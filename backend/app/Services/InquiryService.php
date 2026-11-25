<?php

namespace App\Services;

use App\Models\Inquiry;
use Illuminate\Support\Facades\Mail;
use Throwable;

class InquiryService
{
	public function submit(string $type, array $values): Inquiry
	{
		$inquiry = Inquiry::query()->create([
			'type' => $type,
			'name' => $values['name'],
			'email' => $values['email'],
			'phone' => $values['phone'] ?? null,
			'organization' => $values['organization'] ?? null,
			'subject' => $values['subject'] ?? null,
			'service_of_interest' => $values['service_of_interest'] ?? null,
			'project_description' => $values['project_description'] ?? null,
			'preferred_contact_method' => $values['preferred_contact_method'] ?? null,
			'consent_at' => ($values['consent'] ?? false) ? now() : null,
		]);

		$recipients = config('mail.inquiries_to', []);
		if ($recipients !== []) {
			try {
				Mail::raw($this->notificationBody($inquiry), function ($message) use ($inquiry, $recipients): void {
					$message->to($recipients)
						->replyTo($inquiry->email, $inquiry->name)
						->subject('New CONSOL '.ucfirst($inquiry->type).' inquiry');
				});
			} catch (Throwable $exception) {
				report($exception);
			}
		}

		return $inquiry;
	}

	private function notificationBody(Inquiry $inquiry): string
	{
		return implode("\n", array_filter([
			'A new '.$inquiry->type.' request was submitted through the CONSOL website.',
			'',
			'Name: '.$inquiry->name,
			'Email: '.$inquiry->email,
			$inquiry->phone ? 'Phone: '.$inquiry->phone : null,
			$inquiry->organization ? 'Organization: '.$inquiry->organization : null,
			$inquiry->subject ? 'Subject: '.$inquiry->subject : null,
			$inquiry->service_of_interest ? 'Service of interest: '.$inquiry->service_of_interest : null,
			$inquiry->preferred_contact_method ? 'Preferred contact: '.$inquiry->preferred_contact_method : null,
			'',
			$inquiry->project_description ?? '',
		], fn (?string $line): bool => $line !== null));
	}
}
