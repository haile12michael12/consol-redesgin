<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admins_can_update_public_settings_and_unknown_keys_are_rejected(): void
    {
        $setting = Setting::query()->where('key', 'site.name')->firstOrFail();
        $this->getJson('/api/admin/settings')->assertUnauthorized();
        $administrator = User::factory()->create(['is_admin' => true]);

        $this->actingAs($administrator)
            ->putJson('/api/admin/settings/'.$setting->id, ['value' => 'Construction Solutions PLC'])
            ->assertOk()
            ->assertJsonPath('value', 'Construction Solutions PLC');

        $this->getJson('/api/settings/public')
            ->assertOk()
            ->assertJson(['site.name' => 'Construction Solutions PLC']);
        $this->postJson('/api/admin/settings', [
            'key' => 'mail.password',
            'value' => 'must-not-be-stored',
        ])->assertUnprocessable()->assertJsonValidationErrors(['key']);
    }
}
