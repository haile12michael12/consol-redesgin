<?php

namespace App\Http\Controllers\Api;

use App\Enums\InquiryStatus;
use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\InquiryNote;
use App\Models\User;
use App\Services\InquiryService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InquiryController extends Controller
{
    public function storeContact(Request $request, InquiryService $inquiries): JsonResponse
    {
        $values = $request->validate([
            'website' => ['prohibited'],
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:180'],
            'phone' => ['nullable', 'string', 'max:40'],
            'organization' => ['nullable', 'string', 'max:255'],
            'subject' => ['required', 'string', 'min:3', 'max:160'],
            'message' => ['required', 'string', 'min:20', 'max:4000'],
            'consent' => ['sometimes', 'accepted'],
        ]);

        $inquiry = $inquiries->submit('contact', [
            ...$values,
            'project_description' => $values['message'],
        ]);

        return response()->json([
            'message' => 'Your enquiry has been received.',
            'reference' => $inquiry->id,
        ], 201);
    }

    public function storeConsultation(Request $request, InquiryService $inquiries): JsonResponse
    {
        $values = $request->validate([
            'website' => ['prohibited'],
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:180'],
            'phone' => ['required', 'string', 'min:7', 'max:40'],
            'organization' => ['required', 'string', 'min:2', 'max:255'],
            'service_of_interest' => ['required', 'string', 'max:160'],
            'project_description' => ['required', 'string', 'min:20', 'max:4000'],
            'preferred_contact_method' => ['required', Rule::in(['email', 'phone'])],
        ]);

        $inquiry = $inquiries->submit('consultation', $values);

        return response()->json([
            'message' => 'Your consultation request has been received.',
            'reference' => $inquiry->id,
        ], 201);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Inquiry::class);
        $filters = $this->validatedFilters($request);
        $inquiries = $this->filteredQuery($filters)
            ->with('assignee:id,name,email')
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 25)
            ->through(fn (Inquiry $inquiry) => $this->present($inquiry));

        return response()->json($inquiries);
    }

    public function assignees(): JsonResponse
    {
        Gate::authorize('viewAny', Inquiry::class);

        return response()->json(User::query()
            ->where('is_admin', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email']));
    }

    public function show(Inquiry $inquiry): JsonResponse
    {
        Gate::authorize('view', $inquiry);
        $inquiry->load(['assignee:id,name,email', 'notes.author:id,name']);

        return response()->json($this->present($inquiry, true));
    }

    public function update(Request $request, Inquiry $inquiry): JsonResponse
    {
        Gate::authorize('update', $inquiry);
        abort_unless($request->hasAny(['status', 'assigned_to']), 422);

        $values = $request->validate([
            'status' => ['sometimes', 'required', Rule::enum(InquiryStatus::class)],
            'assigned_to' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('is_admin', true)),
            ],
        ]);
        $inquiry->update($values);

        return response()->json($this->present($inquiry->fresh('assignee:id,name,email')));
    }

    public function addNote(Request $request, Inquiry $inquiry): JsonResponse
    {
        Gate::authorize('addNote', $inquiry);
        $values = $request->validate([
            'body' => ['required', 'string', 'min:1', 'max:4000'],
        ]);
        $note = $inquiry->notes()->create([
            'user_id' => $request->user()->id,
            'body' => $values['body'],
        ]);
        $note->load('author:id,name');

        return response()->json([
            'id' => $note->id,
            'body' => $note->body,
            'author' => $note->author?->name,
            'createdAt' => $note->created_at?->toISOString(),
        ], 201);
    }

    public function export(Request $request): StreamedResponse
    {
        Gate::authorize('export', Inquiry::class);
        $filters = $this->validatedFilters($request);

        return response()->streamDownload(function () use ($filters): void {
            $output = fopen('php://output', 'w');
            fputcsv($output, [
                'ID', 'Type', 'Name', 'Email', 'Phone', 'Organization', 'Subject',
                'Service of interest', 'Project description', 'Preferred contact', 'Status',
                'Assigned administrator', 'Submitted at',
            ]);

            $this->filteredQuery($filters)
                ->with('assignee:id,name')
                ->orderByDesc('created_at')
                ->chunk(500, function ($inquiries) use ($output): void {
                    foreach ($inquiries as $inquiry) {
                        fputcsv($output, array_map(fn ($value) => $this->safeCsvValue($value), [
                            $inquiry->id,
                            $inquiry->type,
                            $inquiry->name,
                            $inquiry->email,
                            $inquiry->phone,
                            $inquiry->organization,
                            $inquiry->subject,
                            $inquiry->service_of_interest,
                            $inquiry->project_description,
                            $inquiry->preferred_contact_method,
                            $inquiry->status->value,
                            $inquiry->assignee?->name,
                            $inquiry->created_at?->toISOString(),
                        ]));
                    }
                });

            fclose($output);
        }, 'consol-inquiries-'.now()->format('Ymd-His').'.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function validatedFilters(Request $request): array
    {
        return $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'type' => ['nullable', Rule::in(['contact', 'consultation'])],
            'status' => ['nullable', Rule::enum(InquiryStatus::class)],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
    }

    private function filteredQuery(array $filters): Builder
    {
        return Inquiry::query()
            ->when($filters['q'] ?? null, function (Builder $query, string $term): void {
                $query->where(function (Builder $query) use ($term): void {
                    $query->where('name', 'like', '%'.$term.'%')
                        ->orWhere('email', 'like', '%'.$term.'%')
                        ->orWhere('organization', 'like', '%'.$term.'%')
                        ->orWhere('subject', 'like', '%'.$term.'%');
                });
            })
            ->when($filters['type'] ?? null, fn (Builder $query, string $type) => $query->where('type', $type))
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status));
    }

    private function present(Inquiry $inquiry, bool $includeNotes = false): array
    {
        $data = [
            'id' => $inquiry->id,
            'type' => $inquiry->type,
            'name' => $inquiry->name,
            'email' => $inquiry->email,
            'phone' => $inquiry->phone,
            'organization' => $inquiry->organization,
            'subject' => $inquiry->subject,
            'serviceOfInterest' => $inquiry->service_of_interest,
            'projectDescription' => $inquiry->project_description,
            'preferredContactMethod' => $inquiry->preferred_contact_method,
            'status' => $inquiry->status->value,
            'assignedTo' => $inquiry->assignee ? [
                'id' => $inquiry->assignee->id,
                'name' => $inquiry->assignee->name,
                'email' => $inquiry->assignee->email,
            ] : null,
            'submittedAt' => $inquiry->created_at?->toISOString(),
        ];

        if ($includeNotes) {
            $data['notes'] = $inquiry->notes->map(fn (InquiryNote $note) => [
                'id' => $note->id,
                'body' => $note->body,
                'author' => $note->author?->name,
                'createdAt' => $note->created_at?->toISOString(),
            ])->values();
        }

        return $data;
    }

    private function safeCsvValue(mixed $value): string|int
    {
        if (! is_string($value)) {
            return $value ?? '';
        }

        return preg_match('/^[\t\r ]*[=+\-@]/', $value) === 1 ? "'".$value : $value;
    }
}