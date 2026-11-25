<?php

namespace App\Http\Requests;

use App\Models\Course;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdministrator() ?? false;
    }

    public function rules(): array
    {
        $course = $this->route('course');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('courses', 'slug')->ignore($course instanceof Course ? $course->id : null),
            ],
            'course_category_id' => ['required', 'integer', Rule::exists('course_categories', 'id')],
            'summary' => ['required', 'string', 'max:2000'],
            'description' => ['required', 'string', 'max:20000'],
            'learning_objectives' => ['nullable', 'array', 'max:30'],
            'learning_objectives.*' => ['required', 'string', 'max:1000'],
            'curriculum' => ['nullable', 'array', 'max:30'],
            'curriculum.*.title' => ['required', 'string', 'max:255'],
            'curriculum.*.description' => ['required', 'string', 'max:1500'],
            'duration' => ['nullable', 'string', 'max:255'],
            'delivery_method' => ['nullable', 'string', 'max:255'],
            'requirements' => ['nullable', 'array', 'max:30'],
            'requirements.*' => ['required', 'string', 'max:1000'],
            'faqs' => ['nullable', 'array', 'max:30'],
            'faqs.*.question' => ['required', 'string', 'max:500'],
            'faqs.*.answer' => ['required', 'string', 'max:3000'],
            'instructors' => ['nullable', 'array', 'max:20'],
            'instructors.*' => ['required', 'integer', 'distinct', Rule::exists('instructors', 'id')],
            'credential_name' => ['nullable', 'required_if:credential_verified,true', 'string', 'max:255'],
            'credential_issuer' => ['nullable', 'required_if:credential_verified,true', 'string', 'max:255'],
            'credential_verified' => ['nullable', 'boolean'],
            'certificate_supported' => ['required', 'boolean'],
            'registration_enabled' => ['required', 'boolean'],
            'featured' => ['required', 'boolean'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:1000'],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
                'dimensions:max_width=6000,max_height=6000',
            ],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'remove_image' => ['nullable', 'boolean'],
        ];
    }
}
