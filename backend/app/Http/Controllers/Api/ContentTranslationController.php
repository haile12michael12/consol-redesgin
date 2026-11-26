<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentTranslation;
use App\Models\Course;
use App\Models\NewsArticle;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ContentTranslationController extends Controller
{
    private const DEFINITIONS = [
        'services' => [
            'model' => Service::class,
            'required' => ['title', 'summary'],
            'fields' => [
                'title' => ['Title', 'text', ['nullable', 'string', 'max:255']],
                'summary' => ['Summary', 'textarea', ['nullable', 'string', 'max:2000']],
                'description' => ['Description', 'textarea', ['nullable', 'string', 'max:10000']],
                'scope' => ['Scope items (JSON)', 'json', ['nullable', 'array']],
                'benefits' => ['Benefits (JSON)', 'json', ['nullable', 'array']],
                'delivery_approach' => ['Delivery approach', 'textarea', ['nullable', 'string', 'max:10000']],
                'related_projects' => ['Related projects (JSON)', 'json', ['nullable', 'array']],
                'faqs' => ['FAQs (JSON)', 'json', ['nullable', 'array']],
            ],
        ],
        'projects' => [
            'model' => Project::class,
            'required' => ['title', 'summary', 'overview'],
            'fields' => [
                'title' => ['Title', 'text', ['nullable', 'string', 'max:255']],
                'summary' => ['Summary', 'textarea', ['nullable', 'string', 'max:2000']],
                'overview' => ['Overview', 'textarea', ['nullable', 'string', 'max:20000']],
                'scope' => ['Scope items (JSON)', 'json', ['nullable', 'array']],
                'services' => ['Services (JSON)', 'json', ['nullable', 'array']],
                'outcomes' => ['Outcomes (JSON)', 'json', ['nullable', 'array']],
                'seo_title' => ['SEO title', 'text', ['nullable', 'string', 'max:255']],
                'seo_description' => ['SEO description', 'textarea', ['nullable', 'string', 'max:1000']],
            ],
        ],
        'news' => [
            'model' => NewsArticle::class,
            'required' => ['title', 'excerpt', 'body'],
            'fields' => [
                'title' => ['Title', 'text', ['nullable', 'string', 'max:255']],
                'excerpt' => ['Excerpt', 'textarea', ['nullable', 'string', 'max:2000']],
                'body' => ['Article body', 'textarea', ['nullable', 'string', 'max:50000']],
                'seo_title' => ['SEO title', 'text', ['nullable', 'string', 'max:255']],
                'seo_description' => ['SEO description', 'textarea', ['nullable', 'string', 'max:1000']],
            ],
        ],
        'training' => [
            'model' => Course::class,
            'required' => ['title', 'summary', 'description'],
            'fields' => [
                'title' => ['Title', 'text', ['nullable', 'string', 'max:255']],
                'summary' => ['Summary', 'textarea', ['nullable', 'string', 'max:2000']],
                'description' => ['Description', 'textarea', ['nullable', 'string', 'max:20000']],
                'learning_objectives' => ['Learning objectives (JSON)', 'json', ['nullable', 'array']],
                'curriculum' => ['Curriculum (JSON)', 'json', ['nullable', 'array']],
                'requirements' => ['Requirements (JSON)', 'json', ['nullable', 'array']],
                'faqs' => ['FAQs (JSON)', 'json', ['nullable', 'array']],
                'seo_title' => ['SEO title', 'text', ['nullable', 'string', 'max:255']],
                'seo_description' => ['SEO description', 'textarea', ['nullable', 'string', 'max:1000']],
            ],
        ],
    ];

    public function index(Request $request): JsonResponse
    {
        $type = $request->validate([
            'type' => ['required', Rule::in(array_keys(self::DEFINITIONS))],
        ])['type'];
        $definition = self::DEFINITIONS[$type];
        $model = $definition['model'];
        $fieldNames = array_keys($definition['fields']);

        $items = $model::query()
            ->with(['translations' => fn ($query) => $query->where('locale', 'am')])
            ->orderBy('title')
            ->get()
            ->map(function (Model $record) use ($fieldNames): array {
                $translation = $record->translations->first();

                return [
                    'id' => $record->getKey(),
                    'slug' => $record->getAttribute('slug'),
                    'title' => $record->getAttribute('title'),
                    'status' => $translation?->status ?? 'missing',
                    'fields' => $translation?->fields ?? [],
                    'publishedFields' => $translation?->published_fields ?? [],
                    'sourceFields' => collect($fieldNames)
                        ->mapWithKeys(fn (string $field) => [$field => $record->getAttribute($field)])
                        ->all(),
                ];
            });

        return response()->json([
            'type' => $type,
            'fields' => collect($definition['fields'])
                ->map(fn (array $field, string $key) => [
                    'key' => $key,
                    'label' => $field[0],
                    'input' => $field[1],
                ])
                ->values(),
            'items' => $items,
        ]);
    }

    public function update(Request $request, string $type, int $record): JsonResponse
    {
        $definition = $this->definition($type);
        $model = $this->record($definition, $record);
        $fields = $this->validatedFields($request, $definition);
        $status = $request->validate([
            'status' => ['required', Rule::in(['draft', 'pending_review'])],
        ])['status'];

        if ($status === 'pending_review') {
            $this->ensureRequiredFields($fields, $definition['required']);
        }

        $translation = $model->translations()->firstOrNew(['locale' => 'am']);
        $translation->fields = $fields;
        $translation->status = $status;
        $translation->submitted_by = $status === 'pending_review' ? $request->user()->getKey() : null;
        $translation->submitted_at = $status === 'pending_review' ? now() : null;
        $translation->save();

        return response()->json($this->present($translation));
    }

    public function approve(Request $request, string $type, int $record): JsonResponse
    {
        $definition = $this->definition($type);
        $model = $this->record($definition, $record);
        $translation = $model->translations()->where('locale', 'am')->firstOrFail();

        abort_unless($translation->status === 'pending_review', 409, 'Only translations awaiting review can be approved.');
        $this->ensureRequiredFields($translation->fields ?? [], $definition['required']);

        $translation->published_fields = $translation->fields;
        $translation->status = 'published';
        $translation->reviewed_by = $request->user()->getKey();
        $translation->reviewed_at = now();
        $translation->save();

        return response()->json($this->present($translation));
    }

    private function definition(string $type): array
    {
        abort_unless(isset(self::DEFINITIONS[$type]), 404);

        return self::DEFINITIONS[$type];
    }

    private function record(array $definition, int $id): Model
    {
        $model = $definition['model'];

        return $model::query()->findOrFail($id);
    }

    private function validatedFields(Request $request, array $definition): array
    {
        $fieldDefinitions = $definition['fields'];
        $rules = [
            'fields' => ['required', 'array:'.implode(',', array_keys($fieldDefinitions))],
        ];

        foreach ($fieldDefinitions as $key => $field) {
            $rules["fields.{$key}"] = $field[2];
        }

        return $request->validate($rules)['fields'];
    }

    private function ensureRequiredFields(array $fields, array $required): void
    {
        $errors = [];
        foreach ($required as $field) {
            if (! isset($fields[$field]) || (is_string($fields[$field]) && trim($fields[$field]) === '')) {
                $errors["fields.{$field}"] = 'This field is required before the translation can be approved.';
            }
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }

    private function present(ContentTranslation $translation): array
    {
        return [
            'id' => $translation->id,
            'locale' => $translation->locale,
            'status' => $translation->status,
            'fields' => $translation->fields ?? [],
            'publishedFields' => $translation->published_fields ?? [],
            'submittedAt' => $translation->submitted_at?->toIso8601String(),
            'reviewedAt' => $translation->reviewed_at?->toIso8601String(),
        ];
    }
}
