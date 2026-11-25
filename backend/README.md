<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## CONSOL services API

The public services catalogue reads only published records from `/api/services`
and `/api/services/{slug}`. Seed the four currently published CONSOL categories
from the approved catalogue after applying migrations:

```bash
php artisan migrate
php artisan db:seed
```

Services are edited from `/admin/services`. Staff must sign in through
`/api/auth/login` with an administrator account. Admin access is determined by
the `users.is_admin` flag; new users are not administrators by default. Grant
that flag only to approved staff through the organisation's controlled account
provisioning process. The admin API supports listing, creating, updating
(including draft/published status), and deleting services. Draft records are
never returned by the public endpoints.

The API persists service summary, description, scope, optional benefits,
delivery approach, verified project references, FAQs, imagery and publication
status. Optional information remains empty until supplied and approved by
CONSOL.

## CONSOL projects API

The public portfolio reads only published projects from `/api/projects`,
`/api/projects/categories`, and `/api/projects/{slug}`. Listing requests support
`q`, `category`, `year`, `featured`, `page`, and `per_page` filters and return a
Laravel paginator. Apply migrations and seed the existing published project
records and their categories with:

```bash
php artisan migrate
php artisan db:seed
```

Projects are managed at `/admin/projects` by signed-in administrators. The
admin API supports project and category CRUD, publication and featured flags,
SEO fields, and multiple gallery uploads. New image uploads are validated as
JPEG, PNG, or WebP (10 MB each, at most 12 images), stored on Laravel's private
local disk, and served through an access-checked image endpoint. Draft project
images are available only to administrators. Do not expose the private disk
with a public storage symlink. Configure PHP/web-server request limits to allow
the largest supported upload and combined multi-image request.

The project seeder contains only engagements already listed as published
CONSOL work. Client and location details are exposed only when their approval
flags are set; project-specific photos, durations, and outcomes remain empty
until verified information is supplied. Grant `users.is_admin` only to
approved staff through the organisation's controlled account provisioning
process.

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
