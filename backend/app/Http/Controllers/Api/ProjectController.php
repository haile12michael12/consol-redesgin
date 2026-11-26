<?php

namespace App\Http\Controllers\Api;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\ProjectImage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'search' => ['nullable', 'string', 'max:200'],
            'category' => ['nullable', 'string', 'max:255'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'featured' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:24'],
        ]);

        $projects = Project::query()
            ->where('status', ContentStatus::Published->value)
            ->with(['categories', 'images', 'translations' => fn ($query) => $query->where('locale', 'am')])
            ->when($filters['q'] ?? $filters['search'] ?? null, function (Builder $query, string $term) {
                $query->where(function (Builder $query) use ($term) {
                    $query->where('title', 'like', '%'.$term.'%')
                        ->orWhere('summary', 'like', '%'.$term.'%')
                        ->orWhere('overview', 'like', '%'.$term.'%');
                });
            })
            ->when($filters['category'] ?? null, fn (Builder $query, string $slug) => $query->whereHas(
                'categories',
                fn (Builder $categories) => $categories->where('project_categories.slug', $slug),
            ))
            ->when($filters['year'] ?? null, fn (Builder $query, int $year) => $query->where('year', $year))
            ->when(
                isset($filters['featured']),
                fn (Builder $query) => $query->where('featured', $filters['featured']),
            )
            ->orderByDesc('featured')
            ->orderByDesc('year')
            ->orderBy('title')
            ->paginate($filters['per_page'] ?? 9)
            ->through(fn (Project $project) => $this->present($project, false, $this->locale($request)));

        return response()->json($projects);
    }

    public function categories(): JsonResponse
    {
        $categories = ProjectCategory::query()
            ->whereHas('projects', fn (Builder $projects) => $projects->where('status', ContentStatus::Published->value))
            ->withCount(['projects as project_count' => fn (Builder $projects) => $projects->where(
                'status',
                ContentStatus::Published->value,
            )])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (ProjectCategory $category) => $this->presentCategory($category));

        return response()->json($categories);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $project = Project::query()
            ->where('slug', $slug)
            ->where('status', ContentStatus::Published->value)
            ->with(['categories', 'images', 'translations' => fn ($query) => $query->where('locale', 'am')])
            ->firstOrFail();
        $locale = $this->locale($request);

        $related = Project::query()
            ->where('status', ContentStatus::Published->value)
            ->where('id', '<>', $project->id)
            ->whereHas('categories', fn (Builder $query) => $query->whereIn(
                'project_categories.id',
                $project->categories->modelKeys(),
            ))
            ->with(['categories', 'images', 'translations' => fn ($query) => $query->where('locale', 'am')])
            ->orderByDesc('featured')
            ->orderByDesc('year')
            ->limit(3)
            ->get()
            ->map(fn (Project $item) => $this->present($item, false, $locale));

        return response()->json([
            ...$this->present($project, false, $locale),
            'relatedProjects' => $related,
        ]);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $projects = Project::query()
            ->with(['categories', 'images'])
            ->when($filters['q'] ?? null, function (Builder $query, string $term) {
                $query->where(function (Builder $query) use ($term) {
                    $query->where('title', 'like', '%'.$term.'%')
                        ->orWhere('slug', 'like', '%'.$term.'%');
                });
            })
            ->orderByDesc('updated_at')
            ->paginate($filters['per_page'] ?? 20)
            ->through(fn (Project $project) => $this->present($project, true));

        return response()->json($projects);
    }

    public function adminCategories(): JsonResponse
    {
        return response()->json(
            ProjectCategory::query()
                ->withCount('projects')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (ProjectCategory $category) => $this->presentCategory($category)),
        );
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->saveProject($request);

        return response()->json($this->present($project, true), 201);
    }

    public function update(StoreProjectRequest $request, Project $project): JsonResponse
    {
        $project = $this->saveProject($request, $project);

        return response()->json($this->present($project, true));
    }

    public function destroy(Project $project): JsonResponse
    {
        $paths = $project->images()->pluck('path')->all();
        $project->delete();

        $this->deleteStoredFiles($paths);

        return response()->json(['message' => 'Project deleted.']);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $category = ProjectCategory::query()->create($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:project_categories,slug'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]));

        return response()->json($this->presentCategory($category), 201);
    }

    public function updateCategory(Request $request, ProjectCategory $category): JsonResponse
    {
        $category->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('project_categories', 'slug')->ignore($category->id),
            ],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]));

        return response()->json($this->presentCategory($category->refresh()));
    }

    public function destroyCategory(ProjectCategory $category): JsonResponse
    {
        if ($category->projects()->exists()) {
            return response()->json([
                'message' => 'Remove this category from its projects before deleting it.',
            ], 409);
        }

        $category->delete();

        return response()->json(['message' => 'Project category deleted.']);
    }

    public function image(Request $request, ProjectImage $projectImage)
    {
        $projectImage->loadMissing('project');
        abort_unless(
            $projectImage->project->status === ContentStatus::Published->value
                || $request->user()?->isAdministrator(),
            404,
        );
        abort_unless(Storage::disk('local')->exists($projectImage->path), 404);

        return Storage::disk('local')->response(
            $projectImage->path,
            null,
            [
                'Cache-Control' => 'private, max-age=3600',
                'X-Content-Type-Options' => 'nosniff',
                'Content-Security-Policy' => "default-src 'none'; sandbox",
            ],
        );
    }

    private function saveProject(StoreProjectRequest $request, ?Project $project = null): Project
    {
        $values = $request->validated();
        $categoryIds = $values['categories'];
        $uploads = $request->file('images', []);
        $imageAlts = $values['image_alts'] ?? [];
        $removeIds = $values['remove_image_ids'] ?? [];
        $attributes = Arr::except($values, [
            'categories',
            'images',
            'image_alts',
            'remove_image_ids',
        ]);

        $attributes['client_approved'] = (bool) ($attributes['client_approved'] ?? false);
        $attributes['location_approved'] = (bool) ($attributes['location_approved'] ?? false);
        if (! $attributes['client_approved']) {
            $attributes['client'] = null;
        }
        if (! $attributes['location_approved']) {
            $attributes['location'] = null;
        }

        $storedPaths = [];
        $removedPaths = [];

        try {
            $saved = DB::transaction(function () use (
                $project,
                $attributes,
                $categoryIds,
                $uploads,
                $imageAlts,
                $removeIds,
                &$storedPaths,
                &$removedPaths,
            ): Project {
                if ($project) {
                    $project->update($attributes);
                } else {
                    $project = Project::query()->create($attributes);
                }

                $project->categories()->sync($categoryIds);

                $removed = $project->images()->whereIn('id', $removeIds)->get();
                $removedPaths = $removed->pluck('path')->all();
                if ($removed->isNotEmpty()) {
                    $project->images()->whereIn('id', $removed->modelKeys())->delete();
                }

                foreach ($uploads as $index => $upload) {
                    $path = $upload->store('projects', ['disk' => 'local']);
                    if (! $path) {
                        throw new RuntimeException('An uploaded project image could not be stored.');
                    }
                    $storedPaths[] = $path;

                    $project->images()->create([
                        'path' => $path,
                        'alt' => $imageAlts[$index] ?? null,
                        'is_cover' => ! $project->images()->where('is_cover', true)->exists(),
                        'sort_order' => (int) $project->images()->max('sort_order') + 1,
                    ]);
                }

                if (! $project->images()->where('is_cover', true)->exists()) {
                    $project->images()->orderBy('sort_order')->orderBy('id')->first()?->update([
                        'is_cover' => true,
                    ]);
                }

                return $project->fresh(['categories', 'images']);
            });
        } catch (Throwable $error) {
            $this->deleteStoredFiles($storedPaths);
            throw $error;
        }

        $this->deleteStoredFiles($removedPaths);

        return $saved;
    }

    private function present(Project $project, bool $admin = false, string $locale = 'en'): array
    {
        $project->loadMissing(['categories', 'images']);
        $images = $project->images->map(fn (ProjectImage $image) => [
            'id' => $image->id,
            'url' => route('api.project-images.show', $image),
            'alt' => $image->alt,
            'isCover' => $image->is_cover,
            'sortOrder' => $image->sort_order,
        ]);
        $cover = $images->firstWhere('isCover', true) ?? $images->first();

        return [
            'id' => $project->id,
            'slug' => $project->slug,
            'title' => $project->localizedValue('title', $locale),
            'summary' => $project->localizedValue('summary', $locale),
            'overview' => $project->localizedValue('overview', $locale),
            'client' => $admin || $project->client_approved ? $project->client : null,
            'clientApproved' => $admin ? $project->client_approved : null,
            'location' => $admin || $project->location_approved ? $project->location : null,
            'locationApproved' => $admin ? $project->location_approved : null,
            'duration' => $project->duration,
            'year' => $project->year,
            'categories' => $project->categories->map(fn (ProjectCategory $category) => [
                'id' => $category->id,
                'slug' => $category->slug,
                'name' => $category->name,
            ]),
            'scope' => $project->localizedValue('scope', $locale) ?? [],
            'services' => $project->localizedValue('services', $locale) ?? [],
            'outcomes' => $project->localizedValue('outcomes', $locale) ?? [],
            'images' => $images,
            'coverImage' => $cover['url'] ?? null,
            'coverImageAlt' => $cover['alt'] ?? null,
            'featured' => $project->featured,
            'status' => $admin ? $project->status : null,
            'seoTitle' => $project->localizedValue('seo_title', $locale),
            'seoDescription' => $project->localizedValue('seo_description', $locale),
        ];
    }

    private function locale(Request $request): string
    {
        return $request->getPreferredLanguage(['en', 'am']) === 'am' ? 'am' : 'en';
    }

    private function presentCategory(ProjectCategory $category): array
    {
        return [
            'id' => $category->id,
            'slug' => $category->slug,
            'name' => $category->name,
            'sortOrder' => $category->sort_order,
            'projectCount' => $category->project_count ?? $category->projects_count ?? null,
        ];
    }

    private function deleteStoredFiles(array $paths): void
    {
        foreach (array_filter($paths) as $path) {
            if (Storage::disk('local')->exists($path) && ! Storage::disk('local')->delete($path)) {
                throw new RuntimeException('A project image could not be removed from storage.');
            }
        }
    }
}
