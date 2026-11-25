<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;

class MediaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'collection' => ['nullable', 'string', 'max:80'],
            'type' => ['nullable', Rule::in(['image', 'document'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
        $media = Media::query()
            ->when($filters['q'] ?? null, fn (Builder $query, string $term) => $query
                ->where('original_name', 'like', '%'.$term.'%'))
            ->when($filters['collection'] ?? null, fn (Builder $query, string $collection) => $query
                ->where('collection', $collection))
            ->when(($filters['type'] ?? null) === 'image', fn (Builder $query) => $query
                ->where('mime_type', 'like', 'image/%'))
            ->when(($filters['type'] ?? null) === 'document', fn (Builder $query) => $query
                ->where('mime_type', 'application/pdf'))
            ->latest()
            ->paginate($filters['per_page'] ?? 24)
            ->through(fn (Media $item) => $this->present($item));

        return response()->json($media);
    }

    public function store(Request $request): JsonResponse
    {
        $values = $request->validate([
            'file' => [
                'required', 'file', 'mimes:jpg,jpeg,png,webp,pdf',
                'extensions:jpg,jpeg,png,webp,pdf', 'max:20480',
            ],
            'alt' => ['nullable', 'string', 'max:255'],
            'collection' => ['nullable', 'string', 'max:80', 'regex:/^[a-z0-9_-]+$/'],
        ]);
        $upload = $request->file('file');
        $path = $upload->store('media', ['disk' => 'local']);
        if (! $path) {
            throw new RuntimeException('The uploaded file could not be stored.');
        }

        try {
            $media = Media::query()->create([
                'uploaded_by' => $request->user()->id,
                'original_name' => $upload->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $upload->getMimeType() ?? 'application/octet-stream',
                'file_size' => $upload->getSize(),
                'alt' => $values['alt'] ?? null,
                'collection' => $values['collection'] ?? 'general',
            ]);
        } catch (Throwable $exception) {
            Storage::disk('local')->delete($path);
            throw $exception;
        }

        return response()->json($this->present($media), 201);
    }

    public function file(Media $media)
    {
        abort_unless(Storage::disk('local')->exists($media->path), 404);

        return Storage::disk('local')->response($media->path, null, [
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
            'Content-Security-Policy' => "default-src 'none'; sandbox",
        ]);
    }

    public function destroy(Media $media): JsonResponse
    {
        $path = $media->path;
        $media->delete();
        Storage::disk('local')->delete($path);

        return response()->json(['message' => 'Media deleted.']);
    }

    private function present(Media $media): array
    {
        return [
            'id' => $media->id,
            'originalName' => $media->original_name,
            'mimeType' => $media->mime_type,
            'fileSize' => $media->file_size,
            'alt' => $media->alt,
            'collection' => $media->collection,
            'url' => route('api.admin.media.file', $media),
            'uploadedAt' => $media->created_at?->toISOString(),
        ];
    }
}
