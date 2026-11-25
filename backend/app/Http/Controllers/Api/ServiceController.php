<?php

namespace App\Http\Controllers\Api;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::query()
            ->where('status', ContentStatus::Published->value)
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return response()->json($services->map(fn (Service $service) => $this->present($service)));
    }

    public function show(string $slug): JsonResponse
    {
        $service = Service::query()
            ->where('slug', $slug)
            ->where('status', ContentStatus::Published->value)
            ->firstOrFail();

        return response()->json($this->present($service));
    }

    public function adminIndex(): JsonResponse
    {
        $services = Service::query()->orderBy('sort_order')->orderBy('title')->get();

        return response()->json($services->map(fn (Service $service) => $this->present($service)));
    }

    public function store(Request $request): JsonResponse
    {
        $service = Service::query()->create($this->validated($request));

        return response()->json($this->present($service), 201);
    }

    public function update(Request $request, Service $service): JsonResponse
    {
        $service->update($this->validated($request, $service));

        return response()->json($this->present($service->refresh()));
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json(['message' => 'Service deleted.']);
    }

    private function validated(Request $request, ?Service $service = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('services', 'slug')->ignore($service?->id),
            ],
            'category' => ['required', Rule::in([
                'construction-management',
                'business-management',
                'training',
                'research',
            ])],
            'summary' => ['required', 'string', 'max:2000'],
            'description' => ['nullable', 'string', 'max:10000'],
            'image' => ['nullable', 'string', 'max:2048'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'scope' => ['sometimes', 'array'],
            'scope.*' => ['required', 'string', 'max:1000'],
            'benefits' => ['nullable', 'array'],
            'benefits.*' => ['required', 'string', 'max:1000'],
            'delivery_approach' => ['nullable', 'string', 'max:10000'],
            'related_projects' => ['nullable', 'array'],
            'related_projects.*.slug' => ['required', 'string', 'max:255'],
            'related_projects.*.title' => ['required', 'string', 'max:255'],
            'related_projects.*.summary' => ['nullable', 'string', 'max:2000'],
            'related_projects.*.client' => ['nullable', 'string', 'max:255'],
            'related_projects.*.year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'related_projects.*.image' => ['nullable', 'string', 'max:2048'],
            'faqs' => ['nullable', 'array'],
            'faqs.*.question' => ['required', 'string', 'max:1000'],
            'faqs.*.answer' => ['required', 'string', 'max:5000'],
            'status' => ['required', Rule::in([
                ContentStatus::Draft->value,
                ContentStatus::Published->value,
            ])],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    private function present(Service $service): array
    {
        return [
            'id' => $service->id,
            'slug' => $service->slug,
            'title' => $service->title,
            'category' => $service->category,
            'summary' => $service->summary,
            'description' => $service->description,
            'image' => $service->image,
            'imageAlt' => $service->image_alt,
            'scope' => $service->scope ?? [],
            'benefits' => $service->benefits ?? [],
            'deliveryApproach' => $service->delivery_approach,
            'relatedProjects' => $service->related_projects ?? [],
            'faqs' => $service->faqs ?? [],
            'status' => $service->status,
            'order' => $service->sort_order,
        ];
    }
}
