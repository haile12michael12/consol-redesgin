<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Inquiry;
use App\Models\NewsArticle;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
	public function summary(): JsonResponse
	{
		$monthStarts = collect(range(5, 0))
			->map(fn (int $offset) => now()->startOfMonth()->subMonths($offset));

		return response()->json([
			'counts' => [
				'totalInquiries' => Inquiry::query()->count(),
				'publishedServices' => Service::query()->where('status', 'published')->count(),
				'totalProjects' => Project::query()->count(),
				'trainingCourses' => Course::query()->count(),
				'trainingRegistrations' => Enrollment::query()->count(),
				'newsArticles' => NewsArticle::query()->count(),
			],
			'charts' => [
				'inquiries' => $this->monthlyCounts(Inquiry::class, $monthStarts),
				'registrations' => $this->monthlyCounts(Enrollment::class, $monthStarts),
			],
			'recentActivity' => ActivityLog::query()
				->with('actor:id,name')
				->latest()
				->limit(8)
				->get()
				->map(fn (ActivityLog $activity) => [
					'id' => $activity->id,
					'action' => $activity->action,
					'resource' => $activity->resource,
					'resourceId' => $activity->resource_id,
					'actor' => $activity->actor?->name,
					'createdAt' => $activity->created_at?->toISOString(),
				]),
		]);
	}

	private function monthlyCounts(string $modelClass, iterable $monthStarts): array
	{
		return collect($monthStarts)
			->map(function ($monthStart) use ($modelClass): array {
				$monthEnd = $monthStart->copy()->endOfMonth();

				return [
					'month' => $monthStart->format('M'),
					'count' => $modelClass::query()
						->whereBetween('created_at', [$monthStart, $monthEnd])
						->count(),
				];
			})
			->values()
			->all();
	}
}
