<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InquiryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_and_consultation_requests_are_validated_and_stored(): void
    {
        $contact = $this->postJson('/api/inquiries', [
            'name' => 'Aster Bekele',
            'email' => 'aster@example.com',
            'phone' => '+251 911 123 456',
            'organization' => 'Example Organization',
            'subject' => 'Consulting information',
            'message' => 'Please contact me about your consulting services.',
            'consent' => true,
        ])->assertCreated();

        $consultation = $this->postJson('/api/consultations', [
            'name' => 'Kebede Abebe',
            'email' => 'kebede@example.com',
            'phone' => '+251 911 222 333',
            'organization' => 'Client Organization',
            'service_of_interest' => 'construction-management-consultancy',
            'project_description' => 'We would like to discuss a project management engagement.',
            'preferred_contact_method' => 'phone',
        ])->assertCreated();

        $this->assertDatabaseHas('inquiries', [
            'id' => $contact->json('reference'),
            'type' => 'contact',
            'organization' => 'Example Organization',
            'subject' => 'Consulting information',
            'status' => 'new',
        ]);
        $this->assertDatabaseHas('inquiries', [
            'id' => $consultation->json('reference'),
            'type' => 'consultation',
            'service_of_interest' => 'construction-management-consultancy',
            'preferred_contact_method' => 'phone',
        ]);

        $this->postJson('/api/inquiries', [
            'website' => 'spam.example',
            'name' => 'Spam Sender',
            'email' => 'spam@example.com',
            'subject' => 'Spam subject',
            'message' => 'A message that should never be stored.',
        ])->assertUnprocessable()->assertJsonValidationErrors(['website']);

        $this->assertDatabaseCount('inquiries', 2);
    }

    public function test_private_inquiry_data_requires_admin_and_supports_assignment_notes_and_status(): void
    {
        $submission = $this->postJson('/api/inquiries', [
            'name' => 'Private Applicant',
            'email' => 'private@example.com',
            'subject' => 'Private enquiry',
            'message' => 'Please keep this enquiry private from public visitors.',
        ])->assertCreated()->json();
        $inquiry = Inquiry::query()->findOrFail($submission['reference']);
        $staff = User::factory()->create(['is_admin' => true]);

        $this->getJson('/api/admin/inquiries')->assertUnauthorized();

        $nonAdmin = User::factory()->create(['is_admin' => false]);
        $this->actingAs($nonAdmin)->getJson('/api/admin/inquiries')->assertForbidden();

        $administrator = User::factory()->create(['is_admin' => true]);
        $this->actingAs($administrator)
            ->putJson('/api/admin/inquiries/'.$inquiry->id, [
                'status' => 'in_progress',
                'assigned_to' => $staff->id,
            ])
            ->assertOk()
            ->assertJsonPath('status', 'in_progress')
            ->assertJsonPath('assignedTo.id', $staff->id);

        $this->postJson('/api/admin/inquiries/'.$inquiry->id.'/notes', [
            'body' => 'Follow up with the applicant next week.',
        ])->assertCreated()->assertJsonPath('author', $administrator->name);

        $this->getJson('/api/admin/inquiries?status=in_progress')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $inquiry->id);
        $this->getJson('/api/admin/inquiries?status=closed')
            ->assertOk()
            ->assertJsonCount(0, 'data');
        $this->getJson('/api/admin/inquiries/'.$inquiry->id)
            ->assertOk()
            ->assertJsonPath('notes.0.body', 'Follow up with the applicant next week.');
        $this->get('/api/admin/inquiries/export')->assertOk();
    }
}