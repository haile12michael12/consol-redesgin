<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminMediaTest extends TestCase
{
    use RefreshDatabase;

    public function test_admins_can_upload_retrieve_and_delete_private_media(): void
    {
        Storage::fake('local');
        $this->getJson('/api/admin/media')->assertUnauthorized();
        $administrator = User::factory()->create(['is_admin' => true]);
        $file = UploadedFile::fake()->image('office-photo.png', 120, 80);

        $media = $this->actingAs($administrator)
            ->postJson('/api/admin/media', [
                'file' => $file,
                'alt' => 'CONSOL office',
                'collection' => 'website',
            ])
            ->assertCreated()
            ->assertJsonPath('originalName', 'office-photo.png')
            ->assertJsonPath('alt', 'CONSOL office')
            ->json();

        $storedMedia = Media::query()->findOrFail($media['id']);
        Storage::disk('local')->assertExists($storedMedia->path);
        $this->assertDatabaseHas('media', [
            'id' => $media['id'],
            'uploaded_by' => $administrator->id,
            'mime_type' => 'image/png',
        ]);

        $this->getJson('/api/admin/media/'.$media['id'].'/file')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->deleteJson('/api/admin/media/'.$media['id'])->assertOk();

        Storage::disk('local')->assertMissing($storedMedia->path);
        $this->assertDatabaseMissing('media', ['id' => $media['id']]);
    }

    public function test_media_upload_rejects_non_approved_file_types(): void
    {
        Storage::fake('local');
        $administrator = User::factory()->create(['is_admin' => true]);

        $this->actingAs($administrator)
            ->postJson('/api/admin/media', [
                'file' => UploadedFile::fake()->createWithContent('script.php', '<?php echo "no";'),
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);

        $this->assertDatabaseCount('media', 0);
    }
}
