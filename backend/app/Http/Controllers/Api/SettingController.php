<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SettingController extends Controller
{
    private const ALLOWED_KEYS = [
        'site.name',
        'site.tagline',
        'site.description',
        'contact.email',
        'contact.landline',
        'contact.mobile',
        'contact.address',
        'seo.title',
        'seo.description',
    ];

    public function index(): JsonResponse
    {
        return response()->json(Setting::query()
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->map(fn (Setting $setting) => $this->present($setting)));
    }

    public function publicIndex(): JsonResponse
    {
        $settings = Setting::query()
            ->where('is_public', true)
            ->orderBy('key')
            ->get()
            ->mapWithKeys(fn (Setting $setting) => [$setting->key => $setting->value]);

        return response()->json($settings);
    }

    public function store(Request $request): JsonResponse
    {
        $values = $request->validate([
            'key' => ['required', 'string', Rule::in(self::ALLOWED_KEYS), 'unique:settings,key'],
            'value' => ['required', 'string', 'max:5000'],
        ]);
        $setting = Setting::query()->create([
            'key' => $values['key'],
            'group' => str($values['key'])->before('.')->toString(),
            'value' => $values['value'],
            'is_public' => true,
            'updated_by' => $request->user()->id,
        ]);

        return response()->json($this->present($setting), 201);
    }

    public function update(Request $request, Setting $setting): JsonResponse
    {
        abort_unless(in_array($setting->key, self::ALLOWED_KEYS, true), 404);
        $values = $request->validate([
            'value' => ['required', 'string', 'max:5000'],
        ]);
        $setting->update([
            'value' => $values['value'],
            'updated_by' => $request->user()->id,
        ]);

        return response()->json($this->present($setting->refresh()));
    }

    public function destroy(Setting $setting): JsonResponse
    {
        abort_unless(in_array($setting->key, self::ALLOWED_KEYS, true), 404);
        $setting->delete();

        return response()->json(['message' => 'Setting deleted.']);
    }

    private function present(Setting $setting): array
    {
        return [
            'id' => $setting->id,
            'key' => $setting->key,
            'group' => $setting->group,
            'value' => $setting->value,
            'isPublic' => $setting->is_public,
            'updatedAt' => $setting->updated_at?->toISOString(),
        ];
    }
}
