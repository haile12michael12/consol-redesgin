<?php

namespace App\Http\Requests;

use App\Models\NewsArticle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNewsArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdministrator() ?? false;
    }

    public function rules(): array
    {
        $article = $this->route('newsArticle');
        $scheduled = $this->input('status') === 'scheduled';

        return [
            'news_category_id' => ['nullable', 'integer', Rule::exists('news_categories', 'id')],
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('news_articles', 'slug')->ignore($article instanceof NewsArticle ? $article->id : null),
            ],
            'excerpt' => ['required', 'string', 'max:2000'],
            'body' => ['required', 'string', 'max:50000'],
            'featured' => ['required', 'boolean'],
            'status' => ['required', Rule::in(['draft', 'scheduled', 'published'])],
            'published_at' => [$scheduled ? 'required' : 'nullable', 'date', $scheduled ? 'after:now' : 'sometimes'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:1000'],
            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
                'dimensions:max_width=6000,max_height=6000',
            ],
            'cover_image_alt' => ['nullable', 'string', 'max:255'],
            'remove_cover_image' => ['nullable', 'boolean'],
        ];
    }
}
