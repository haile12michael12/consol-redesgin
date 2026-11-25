<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCorporateEventRequest;
use App\Http\Requests\StoreNewsArticleRequest;
use App\Http\Requests\StoreResourceDocumentRequest;
use App\Models\CorporateEvent;
use App\Models\NewsArticle;
use App\Models\NewsCategory;
use App\Models\ResourceDocument;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;

class NewsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'category' => ['nullable', 'string', 'max:255'],
            'featured' => ['nullable', 'boolean'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:24'],
        ]);

        $articles = $this->publicArticles()
            ->with('category')
            ->when($filters['q'] ?? null, function (Builder $query, string $term) {
                $query->where(function (Builder $query) use ($term) {
                    $query->where('title', 'like', '%'.$term.'%')
                        ->orWhere('excerpt', 'like', '%'.$term.'%')
                        ->orWhere('body', 'like', '%'.$term.'%');
                });
            })
            ->when($filters['category'] ?? null, fn (Builder $query, string $slug) => $query->whereHas(
                'category',
                fn (Builder $category) => $category->where('slug', $slug),
            ))
            ->when(
                isset($filters['featured']),
                fn (Builder $query) => $query->where('featured', $filters['featured']),
            )
            ->orderByDesc('featured')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate($filters['per_page'] ?? 9)
            ->through(fn (NewsArticle $article) => $this->presentArticle($article));

        return response()->json($articles);
    }

    public function categories(): JsonResponse
    {
        $categories = NewsCategory::query()
            ->whereHas('articles', fn (Builder $articles) => $this->wherePublic($articles))
            ->withCount(['articles as article_count' => fn (Builder $articles) => $this->wherePublic($articles)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (NewsCategory $category) => $this->presentCategory($category));

        return response()->json($categories);
    }

    public function showArticle(string $slug): JsonResponse
    {
        $article = $this->publicArticles()
            ->where('slug', $slug)
            ->with('category')
            ->firstOrFail();

        $related = $this->publicArticles()
            ->where('id', '<>', $article->id)
            ->when($article->news_category_id, fn (Builder $query) => $query->where(
                'news_category_id',
                $article->news_category_id,
            ))
            ->with('category')
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn (NewsArticle $item) => $this->presentArticle($item));

        return response()->json([
            ...$this->presentArticle($article),
            'relatedArticles' => $related,
        ]);
    }

    public function events(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'period' => ['nullable', Rule::in(['upcoming', 'past'])],
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:24'],
        ]);

        $events = $this->publicEvents()
            ->when($filters['q'] ?? null, function (Builder $query, string $term) {
                $query->where(function (Builder $query) use ($term) {
                    $query->where('title', 'like', '%'.$term.'%')
                        ->orWhere('summary', 'like', '%'.$term.'%')
                        ->orWhere('venue', 'like', '%'.$term.'%');
                });
            })
            ->when(($filters['period'] ?? null) === 'upcoming', function (Builder $query) {
                $query->where(fn (Builder $query) => $query
                    ->where('starts_at', '>=', now())
                    ->orWhere('ends_at', '>=', now()))
                    ->orderBy('starts_at');
            })
            ->when(($filters['period'] ?? null) === 'past', function (Builder $query) {
                $query->where('starts_at', '<', now())
                    ->where(fn (Builder $query) => $query->whereNull('ends_at')->orWhere('ends_at', '<', now()))
                    ->orderByDesc('starts_at');
            })
            ->when(! isset($filters['period']), fn (Builder $query) => $query->orderByDesc('starts_at'))
            ->paginate($filters['per_page'] ?? 9)
            ->through(fn (CorporateEvent $event) => $this->presentEvent($event));

        return response()->json($events);
    }

    public function showEvent(string $slug): JsonResponse
    {
        $event = $this->publicEvents()->where('slug', $slug)->firstOrFail();
        $related = $this->publicEvents()
            ->where('id', '<>', $event->id)
            ->orderByDesc('starts_at')
            ->limit(3)
            ->get()
            ->map(fn (CorporateEvent $item) => $this->presentEvent($item));

        return response()->json([
            ...$this->presentEvent($event),
            'relatedEvents' => $related,
        ]);
    }

    public function resources(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:24'],
        ]);

        $resources = $this->publicResources()
            ->when($filters['q'] ?? null, fn (Builder $query, string $term) => $query
                ->where(fn (Builder $query) => $query
                    ->where('title', 'like', '%'.$term.'%')
                    ->orWhere('description', 'like', '%'.$term.'%')))
            ->orderByDesc('published_at')
            ->paginate($filters['per_page'] ?? 12)
            ->through(fn (ResourceDocument $resource) => $this->presentResource($resource));

        return response()->json($resources);
    }

    public function adminArticles(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $articles = NewsArticle::query()
            ->with('category')
            ->when($filters['q'] ?? null, fn (Builder $query, string $term) => $query
                ->where(fn (Builder $query) => $query
                    ->where('title', 'like', '%'.$term.'%')
                    ->orWhere('slug', 'like', '%'.$term.'%')))
            ->orderByDesc('updated_at')
            ->paginate($filters['per_page'] ?? 20)
            ->through(fn (NewsArticle $article) => $this->presentArticle($article, true));

        return response()->json($articles);
    }

    public function adminCategories(): JsonResponse
    {
        return response()->json(
            NewsCategory::query()
                ->withCount('articles')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (NewsCategory $category) => $this->presentCategory($category)),
        );
    }

    public function storeArticle(StoreNewsArticleRequest $request): JsonResponse
    {
        return response()->json($this->presentArticle($this->saveArticle($request), true), 201);
    }

    public function updateArticle(StoreNewsArticleRequest $request, NewsArticle $newsArticle): JsonResponse
    {
        return response()->json($this->presentArticle($this->saveArticle($request, $newsArticle), true));
    }

    public function destroyArticle(NewsArticle $newsArticle): JsonResponse
    {
        $path = $newsArticle->cover_image_path;
        $newsArticle->delete();
        $this->deleteStoredFiles([$path]);

        return response()->json(['message' => 'Article deleted.']);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $category = NewsCategory::query()->create($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:news_categories,slug'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]));

        return response()->json($this->presentCategory($category), 201);
    }

    public function updateCategory(Request $request, NewsCategory $category): JsonResponse
    {
        $category->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('news_categories', 'slug')->ignore($category->id),
            ],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]));

        return response()->json($this->presentCategory($category->refresh()));
    }

    public function destroyCategory(NewsCategory $category): JsonResponse
    {
        if ($category->articles()->exists()) {
            return response()->json([
                'message' => 'Reassign or remove this category from its articles before deleting it.',
            ], 409);
        }

        $category->delete();

        return response()->json(['message' => 'News category deleted.']);
    }

    public function adminEvents(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        return response()->json(
            CorporateEvent::query()
                ->when($filters['q'] ?? null, fn (Builder $query, string $term) => $query
                    ->where(fn (Builder $query) => $query
                        ->where('title', 'like', '%'.$term.'%')
                        ->orWhere('slug', 'like', '%'.$term.'%')))
                ->orderByDesc('updated_at')
                ->paginate($filters['per_page'] ?? 20)
                ->through(fn (CorporateEvent $event) => $this->presentEvent($event, true)),
        );
    }

    public function storeEvent(StoreCorporateEventRequest $request): JsonResponse
    {
        return response()->json($this->presentEvent($this->saveEvent($request), true), 201);
    }

    public function updateEvent(StoreCorporateEventRequest $request, CorporateEvent $event): JsonResponse
    {
        return response()->json($this->presentEvent($this->saveEvent($request, $event), true));
    }

    public function destroyEvent(CorporateEvent $event): JsonResponse
    {
        $path = $event->cover_image_path;
        $event->delete();
        $this->deleteStoredFiles([$path]);

        return response()->json(['message' => 'Event deleted.']);
    }

    public function adminResources(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        return response()->json(
            ResourceDocument::query()
                ->when($filters['q'] ?? null, fn (Builder $query, string $term) => $query
                    ->where(fn (Builder $query) => $query
                        ->where('title', 'like', '%'.$term.'%')
                        ->orWhere('slug', 'like', '%'.$term.'%')))
                ->orderByDesc('updated_at')
                ->paginate($filters['per_page'] ?? 20)
                ->through(fn (ResourceDocument $resource) => $this->presentResource($resource, true)),
        );
    }

    public function storeResource(StoreResourceDocumentRequest $request): JsonResponse
    {
        return response()->json($this->presentResource($this->saveResource($request), true), 201);
    }

    public function updateResource(StoreResourceDocumentRequest $request, ResourceDocument $resource): JsonResponse
    {
        return response()->json($this->presentResource($this->saveResource($request, $resource), true));
    }

    public function destroyResource(ResourceDocument $resource): JsonResponse
    {
        $path = $resource->file_path;
        $resource->delete();
        $this->deleteStoredFiles([$path]);

        return response()->json(['message' => 'Resource deleted.']);
    }

    public function articleImage(Request $request, NewsArticle $newsArticle)
    {
        return $this->serveImage($request, $newsArticle->status, $newsArticle->published_at, $newsArticle->cover_image_path);
    }

    public function eventImage(Request $request, CorporateEvent $event)
    {
        return $this->serveImage($request, $event->status, $event->published_at, $event->cover_image_path);
    }

    public function downloadResource(Request $request, ResourceDocument $resource)
    {
        $administrator = $request->user()?->isAdministrator() ?? false;
        abort_unless(
            $administrator || (
                $resource->approved_for_publication
                && $this->isPublic($resource->status, $resource->published_at)
            ),
            404,
        );
        abort_unless(Storage::disk('local')->exists($resource->file_path), 404);

        return Storage::disk('local')->download(
            $resource->file_path,
            $resource->file_name,
            [
                'Cache-Control' => $administrator ? 'private, no-store' : 'private, max-age=3600',
                'X-Content-Type-Options' => 'nosniff',
                'Content-Security-Policy' => "default-src 'none'; sandbox",
            ],
        );
    }

    private function saveArticle(StoreNewsArticleRequest $request, ?NewsArticle $article = null): NewsArticle
    {
        $values = $request->validated();
        $upload = $request->file('cover_image');
        $oldPath = $article?->cover_image_path;
        $attributes = Arr::except($values, ['cover_image', 'remove_cover_image']);
        $newPath = null;

        if ($upload) {
            $newPath = $upload->store('news', ['disk' => 'local']);
            if (! $newPath) {
                throw new RuntimeException('The article cover image could not be stored.');
            }
            $attributes['cover_image_path'] = $newPath;
        } elseif ($request->boolean('remove_cover_image')) {
            $attributes['cover_image_path'] = null;
            $attributes['cover_image_alt'] = null;
        } else {
            unset($attributes['cover_image_alt']);
        }

        if ($attributes['status'] === 'published' && empty($attributes['published_at'])) {
            $attributes['published_at'] = now();
        }

        try {
            $saved = DB::transaction(function () use ($article, $attributes): NewsArticle {
                if ($article) {
                    $article->update($attributes);
                    $article = $article->refresh();
                } else {
                    $article = NewsArticle::query()->create($attributes);
                }

                if ($article->featured) {
                    NewsArticle::query()->whereKeyNot($article->id)->update(['featured' => false]);
                }

                return $article->load('category');
            });
        } catch (Throwable $error) {
            $this->deleteStoredFiles([$newPath]);
            throw $error;
        }

        if ($oldPath && $oldPath !== $saved->cover_image_path) {
            $this->deleteStoredFiles([$oldPath]);
        }

        return $saved;
    }

    private function saveEvent(StoreCorporateEventRequest $request, ?CorporateEvent $event = null): CorporateEvent
    {
        $values = $request->validated();
        $upload = $request->file('cover_image');
        $oldPath = $event?->cover_image_path;
        $attributes = Arr::except($values, ['cover_image', 'remove_cover_image']);
        $newPath = null;

        if ($upload) {
            $newPath = $upload->store('events', ['disk' => 'local']);
            if (! $newPath) {
                throw new RuntimeException('The event cover image could not be stored.');
            }
            $attributes['cover_image_path'] = $newPath;
        } elseif ($request->boolean('remove_cover_image')) {
            $attributes['cover_image_path'] = null;
            $attributes['cover_image_alt'] = null;
        } else {
            unset($attributes['cover_image_alt']);
        }

        if ($attributes['status'] === 'published' && empty($attributes['published_at'])) {
            $attributes['published_at'] = now();
        }

        try {
            $saved = DB::transaction(function () use ($event, $attributes): CorporateEvent {
                if ($event) {
                    $event->update($attributes);
                    return $event->refresh();
                }

                return CorporateEvent::query()->create($attributes);
            });
        } catch (Throwable $error) {
            $this->deleteStoredFiles([$newPath]);
            throw $error;
        }

        if ($oldPath && $oldPath !== $saved->cover_image_path) {
            $this->deleteStoredFiles([$oldPath]);
        }

        return $saved;
    }

    private function saveResource(StoreResourceDocumentRequest $request, ?ResourceDocument $resource = null): ResourceDocument
    {
        $values = $request->validated();
        $upload = $request->file('file');
        $oldPath = $resource?->file_path;
        $attributes = Arr::except($values, ['file']);
        $newPath = null;

        if ($upload) {
            $newPath = $upload->store('resources', ['disk' => 'local']);
            if (! $newPath) {
                throw new RuntimeException('The resource file could not be stored.');
            }
            $attributes['file_path'] = $newPath;
            $attributes['file_name'] = preg_replace(
                '/[^\pL\pN._ -]/u',
                '_',
                basename(str_replace('\\', '/', $upload->getClientOriginalName())),
            ) ?: 'resource.pdf';
            $attributes['mime_type'] = 'application/pdf';
            $attributes['file_size'] = $upload->getSize();
        }

        if ($attributes['status'] === 'published' && empty($attributes['published_at'])) {
            $attributes['published_at'] = now();
        }

        try {
            $saved = DB::transaction(function () use ($resource, $attributes): ResourceDocument {
                if ($resource) {
                    $resource->update($attributes);
                    return $resource->refresh();
                }

                return ResourceDocument::query()->create($attributes);
            });
        } catch (Throwable $error) {
            $this->deleteStoredFiles([$newPath]);
            throw $error;
        }

        if ($oldPath && $oldPath !== $saved->file_path) {
            $this->deleteStoredFiles([$oldPath]);
        }

        return $saved;
    }

    private function publicArticles(): Builder
    {
        return $this->wherePublic(NewsArticle::query());
    }

    private function publicEvents(): Builder
    {
        return $this->wherePublic(CorporateEvent::query());
    }

    private function publicResources(): Builder
    {
        return $this->wherePublic(ResourceDocument::query())
            ->where('approved_for_publication', true);
    }

    private function wherePublic(Builder $query): Builder
    {
        return $query->where(function (Builder $query) {
            $query->where(function (Builder $query) {
                $query->where('status', 'published')
                    ->where(fn (Builder $query) => $query->whereNull('published_at')->orWhere('published_at', '<=', now()));
            })->orWhere(function (Builder $query) {
                $query->where('status', 'scheduled')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
            });
        });
    }

    private function isPublic(string $status, $publishedAt): bool
    {
        if ($status === 'published') {
            return $publishedAt === null || $publishedAt->isPast();
        }

        return $status === 'scheduled' && $publishedAt !== null && $publishedAt->isPast();
    }

    private function serveImage(Request $request, string $status, $publishedAt, ?string $path)
    {
        $administrator = $request->user()?->isAdministrator() ?? false;
        abort_unless($this->isPublic($status, $publishedAt) || $administrator, 404);
        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->response($path, null, [
            'Cache-Control' => $administrator ? 'private, no-store' : 'private, max-age=3600',
            'X-Content-Type-Options' => 'nosniff',
            'Content-Security-Policy' => "default-src 'none'; sandbox",
        ]);
    }

    private function presentArticle(NewsArticle $article, bool $admin = false): array
    {
        $article->loadMissing('category');

        return [
            'id' => $article->id,
            'slug' => $article->slug,
            'title' => $article->title,
            'excerpt' => $article->excerpt,
            'body' => preg_split('/\R{2,}/', trim($article->body), -1, PREG_SPLIT_NO_EMPTY),
            'date' => $article->published_at?->toDateString(),
            'publishedAt' => $article->published_at?->toIso8601String(),
            'category' => $article->category?->slug,
            'categoryName' => $article->category?->name,
            'categoryId' => $article->news_category_id,
            'featured' => $article->featured,
            'image' => $article->cover_image_path ? route('api.news-images.show', $article) : null,
            'imageAlt' => $article->cover_image_alt,
            'status' => $admin ? $article->status : null,
            'seoTitle' => $article->seo_title,
            'seoDescription' => $article->seo_description,
        ];
    }

    private function presentEvent(CorporateEvent $event, bool $admin = false): array
    {
        return [
            'id' => $event->id,
            'slug' => $event->slug,
            'title' => $event->title,
            'summary' => $event->summary,
            'body' => $event->body ? preg_split('/\R{2,}/', trim($event->body), -1, PREG_SPLIT_NO_EMPTY) : [],
            'date' => $event->starts_at?->toDateString(),
            'startsAt' => $event->starts_at?->toIso8601String(),
            'endsAt' => $event->ends_at?->toIso8601String(),
            'venue' => $event->venue,
            'location' => $event->venue,
            'registrationUrl' => $event->registration_url,
            'image' => $event->cover_image_path ? route('api.event-images.show', $event) : null,
            'imageAlt' => $event->cover_image_alt,
            'status' => $admin ? $event->status : null,
            'seoTitle' => $event->seo_title,
            'seoDescription' => $event->seo_description,
        ];
    }

    private function presentResource(ResourceDocument $resource, bool $admin = false): array
    {
        return [
            'id' => $resource->id,
            'slug' => $resource->slug,
            'title' => $resource->title,
            'description' => $resource->description,
            'fileName' => $resource->file_name,
            'fileSize' => $resource->file_size,
            'publishedAt' => $resource->published_at?->toIso8601String(),
            'downloadUrl' => route('api.resources.download', $resource),
            'status' => $admin ? $resource->status : null,
            'approvedForPublication' => $admin ? $resource->approved_for_publication : null,
            'seoTitle' => $resource->seo_title,
            'seoDescription' => $resource->seo_description,
        ];
    }

    private function presentCategory(NewsCategory $category): array
    {
        return [
            'id' => $category->id,
            'slug' => $category->slug,
            'name' => $category->name,
            'sortOrder' => $category->sort_order,
            'articleCount' => $category->article_count ?? $category->articles_count ?? null,
        ];
    }

    private function deleteStoredFiles(array $paths): void
    {
        foreach (array_filter($paths) as $path) {
            if (Storage::disk('local')->exists($path) && ! Storage::disk('local')->delete($path)) {
                throw new RuntimeException('A content file could not be removed from storage.');
            }
        }
    }
}
