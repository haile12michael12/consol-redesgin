<?php

namespace App\Http\Controllers\Api;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PageController extends Controller
{
	public function index(): JsonResponse
	{
		$pages = Page::query()
			->where('status', ContentStatus::Published->value)
			->where(fn (Builder $query) => $query->whereNull('published_at')->orWhere('published_at', '<=', now()))
			->orderBy('path')
			->paginate(50)
			->through(fn (Page $page) => $this->present($page));

		return response()->json($pages);
	}

	public function show(string $slug): JsonResponse
	{
		$page = Page::query()
			->where('slug', $slug)
			->where('status', ContentStatus::Published->value)
			->where(fn (Builder $query) => $query->whereNull('published_at')->orWhere('published_at', '<=', now()))
			->firstOrFail();

		return response()->json($this->present($page));
	}

	public function adminIndex(Request $request): JsonResponse
	{
		$filters = $request->validate([
			'q' => ['nullable', 'string', 'max:200'],
			'status' => ['nullable', Rule::in(['draft', 'published'])],
			'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
		]);
		$pages = Page::query()
			->when($filters['q'] ?? null, fn (Builder $query, string $term) => $query
				->where(fn (Builder $query) => $query
					->where('title', 'like', '%'.$term.'%')
					->orWhere('path', 'like', '%'.$term.'%')))
			->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
			->orderByDesc('updated_at')
			->paginate($filters['per_page'] ?? 20)
			->through(fn (Page $page) => $this->present($page));

		return response()->json($pages);
	}

	public function store(Request $request): JsonResponse
	{
		$page = Page::query()->create([
			...$this->validated($request),
			'updated_by' => $request->user()->id,
		]);

		return response()->json($this->present($page), 201);
	}

	public function update(Request $request, Page $page): JsonResponse
	{
		$page->update([
			...$this->validated($request, $page),
			'updated_by' => $request->user()->id,
		]);

		return response()->json($this->present($page->refresh()));
	}

	public function destroy(Page $page): JsonResponse
	{
		$page->delete();

		return response()->json(['message' => 'Page deleted.']);
	}

	private function validated(Request $request, ?Page $page = null): array
	{
		return $request->validate([
			'title' => ['required', 'string', 'max:255'],
			'slug' => [
				'required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
				Rule::unique('pages', 'slug')->ignore($page?->id),
			],
			'path' => ['required', 'string', 'max:255', 'regex:/^\/[a-z0-9\/-]*$/', Rule::unique('pages', 'path')->ignore($page?->id)],
			'summary' => ['nullable', 'string', 'max:2000'],
			'content' => ['nullable', 'string', 'max:100000'],
			'sections' => ['nullable', 'array', 'max:50'],
			'status' => ['required', Rule::in([ContentStatus::Draft->value, ContentStatus::Published->value])],
			'published_at' => ['nullable', 'date'],
			'seo_title' => ['nullable', 'string', 'max:255'],
			'seo_description' => ['nullable', 'string', 'max:1000'],
		]);
	}

	private function present(Page $page): array
	{
		return [
			'id' => $page->id,
			'slug' => $page->slug,
			'path' => $page->path,
			'title' => $page->title,
			'summary' => $page->summary,
			'content' => $page->content,
			'sections' => $page->sections ?? [],
			'status' => $page->status,
			'publishedAt' => $page->published_at?->toISOString(),
			'seoTitle' => $page->seo_title,
			'seoDescription' => $page->seo_description,
			'updatedAt' => $page->updated_at?->toISOString(),
		];
	}
}
