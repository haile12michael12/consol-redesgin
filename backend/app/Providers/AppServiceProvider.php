<?php

namespace App\Providers;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Inquiry;
use App\Models\Role;
use App\Models\User;
use App\Policies\CertificatePolicy;
use App\Policies\CoursePolicy;
use App\Policies\EnrollmentPolicy;
use App\Policies\InquiryPolicy;
use App\Policies\RolePolicy;
use App\Policies\UserPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(
            fn (object $user, string $token): string => rtrim(config('app.frontend_url'), '/')
                .'/admin/reset-password?'.http_build_query([
                    'token' => $token,
                    'email' => $user->getEmailForPasswordReset(),
                ]),
        );

        Gate::policy(Course::class, CoursePolicy::class);
        Gate::policy(Enrollment::class, EnrollmentPolicy::class);
        Gate::policy(Inquiry::class, InquiryPolicy::class);
        Gate::policy(Certificate::class, CertificatePolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}
