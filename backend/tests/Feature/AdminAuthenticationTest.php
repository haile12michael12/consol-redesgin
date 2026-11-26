<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AdminAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_change_requires_the_current_password_and_revokes_other_sessions(): void
    {
        config(['session.driver' => 'database']);
        $this->withHeader('Origin', 'http://localhost');
        $user = User::factory()->create(['password' => 'CurrentPassword123!']);

        $this->actingAs($user)
            ->putJson('/api/auth/password', [
                'current_password' => 'incorrect',
                'password' => 'UpdatedPassword123!',
                'password_confirmation' => 'UpdatedPassword123!',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password']);

        DB::table('sessions')->insert([
            'id' => 'other-active-session',
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Test browser',
            'payload' => '',
            'last_activity' => now()->timestamp,
        ]);

        $this->actingAs($user)
            ->putJson('/api/auth/password', [
                'current_password' => 'CurrentPassword123!',
                'password' => 'UpdatedPassword123!',
                'password_confirmation' => 'UpdatedPassword123!',
            ])
            ->assertOk();

        $this->assertTrue(password_verify('UpdatedPassword123!', $user->fresh()->password));
        $this->assertDatabaseMissing('sessions', ['id' => 'other-active-session']);
    }

    public function test_session_endpoints_only_revoke_sessions_belonging_to_the_authenticated_user(): void
    {
        config(['session.driver' => 'database']);
        $this->withHeader('Origin', 'http://localhost');
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        DB::table('sessions')->insert([
            [
                'id' => 'owned-session',
                'user_id' => $user->id,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Owned browser',
                'payload' => '',
                'last_activity' => now()->timestamp,
            ],
            [
                'id' => 'other-users-session',
                'user_id' => $otherUser->id,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Other browser',
                'payload' => '',
                'last_activity' => now()->timestamp,
            ],
        ]);

        $this->actingAs($user)
            ->getJson('/api/auth/sessions')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', 'owned-session');

        $this->actingAs($user)->deleteJson('/api/auth/sessions/other-users-session')->assertNotFound();
        $this->actingAs($user)->deleteJson('/api/auth/sessions/owned-session')->assertOk();
        $this->assertDatabaseHas('sessions', ['id' => 'other-users-session']);
    }

    public function test_password_reset_email_does_not_disclose_account_existence_and_token_resets_password(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $this->postJson('/api/auth/password/forgot', ['email' => 'missing@example.com'])
            ->assertOk()
            ->assertJsonPath('message', 'If an account exists for that address, password reset instructions will be emailed.');
        $this->postJson('/api/auth/password/forgot', ['email' => $user->email])
            ->assertOk()
            ->assertJsonPath('message', 'If an account exists for that address, password reset instructions will be emailed.');

        Notification::assertSentTo($user, ResetPassword::class);

        $token = Password::createToken($user);
        $this->postJson('/api/auth/password/reset', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'ResetPassword123!',
            'password_confirmation' => 'ResetPassword123!',
        ])->assertOk();

        $this->assertTrue(password_verify('ResetPassword123!', $user->fresh()->password));
    }

    public function test_only_super_administrators_can_assign_administrator_roles(): void
    {
        $editor = User::factory()->create(['is_admin' => false]);
        $editor->roles()->attach(Role::query()->where('name', 'administrator')->firstOrFail());
        $administratorRole = Role::query()->where('name', 'administrator')->firstOrFail();

        $this->actingAs($editor)->postJson('/api/admin/users', [
            'name' => 'Escalated user',
            'email' => 'escalated@example.com',
            'password' => 'SecurePassword123!',
            'role_ids' => [$administratorRole->id],
        ])->assertForbidden();
    }
}
