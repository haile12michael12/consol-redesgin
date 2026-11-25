<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\ServiceController;

Route::get('/health', fn () => response()->json([
    'status' => 'ok',
    'service' => 'CONSOL backend',
]));

Route::middleware('web')->prefix('auth')->group(function () {
    Route::get('/csrf-cookie', fn () => response()->noContent());
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth');
});

Route::middleware(['web', 'auth', 'admin'])->prefix('admin/services')->group(function () {
    Route::get('/', [ServiceController::class, 'adminIndex']);
    Route::post('/', [ServiceController::class, 'store']);
    Route::put('/{service}', [ServiceController::class, 'update']);
    Route::delete('/{service}', [ServiceController::class, 'destroy']);
});

Route::middleware(['web', 'auth', 'admin'])->prefix('admin/projects')->group(function () {
    Route::get('/', [ProjectController::class, 'adminIndex']);
    Route::post('/', [ProjectController::class, 'store']);
    Route::put('/{project}', [ProjectController::class, 'update']);
    Route::delete('/{project}', [ProjectController::class, 'destroy']);
    Route::get('/categories', [ProjectController::class, 'adminCategories']);
    Route::post('/categories', [ProjectController::class, 'storeCategory']);
    Route::put('/categories/{category}', [ProjectController::class, 'updateCategory']);
    Route::delete('/categories/{category}', [ProjectController::class, 'destroyCategory']);
});

Route::middleware('web')
    ->get('/project-images/{projectImage}', [ProjectController::class, 'image'])
    ->name('api.project-images.show');

Route::get('/projects/categories', [ProjectController::class, 'categories']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);

Route::middleware(['web', 'auth', 'admin'])->prefix('admin/news')->group(function () {
    Route::get('/', [NewsController::class, 'adminArticles']);
    Route::post('/', [NewsController::class, 'storeArticle']);
    Route::put('/{newsArticle}', [NewsController::class, 'updateArticle']);
    Route::delete('/{newsArticle}', [NewsController::class, 'destroyArticle']);

    Route::get('/categories', [NewsController::class, 'adminCategories']);
    Route::post('/categories', [NewsController::class, 'storeCategory']);
    Route::put('/categories/{category}', [NewsController::class, 'updateCategory']);
    Route::delete('/categories/{category}', [NewsController::class, 'destroyCategory']);
});

Route::middleware(['web', 'auth', 'admin'])->prefix('admin/events')->group(function () {
    Route::get('/', [NewsController::class, 'adminEvents']);
    Route::post('/', [NewsController::class, 'storeEvent']);
    Route::put('/{event}', [NewsController::class, 'updateEvent']);
    Route::delete('/{event}', [NewsController::class, 'destroyEvent']);
});

Route::middleware(['web', 'auth', 'admin'])->prefix('admin/resources')->group(function () {
    Route::get('/', [NewsController::class, 'adminResources']);
    Route::post('/', [NewsController::class, 'storeResource']);
    Route::put('/{resource}', [NewsController::class, 'updateResource']);
    Route::delete('/{resource}', [NewsController::class, 'destroyResource']);
});

Route::middleware('web')
    ->get('/news-images/{newsArticle}', [NewsController::class, 'articleImage'])
    ->name('api.news-images.show');
Route::middleware('web')
    ->get('/event-images/{event}', [NewsController::class, 'eventImage'])
    ->name('api.event-images.show');
Route::middleware('web')
    ->get('/resources/{resource}/download', [NewsController::class, 'downloadResource'])
    ->name('api.resources.download');

Route::get('/news/categories', [NewsController::class, 'categories']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{slug}', [NewsController::class, 'showArticle']);
Route::get('/events', [NewsController::class, 'events']);
Route::get('/events/{slug}', [NewsController::class, 'showEvent']);
Route::get('/resources', [NewsController::class, 'resources']);

Route::middleware(['web', 'auth', 'admin'])->prefix('admin/training')->group(function () {
    Route::get('/courses', [CourseController::class, 'adminIndex']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{course}', [CourseController::class, 'update']);
    Route::delete('/courses/{course}', [CourseController::class, 'destroy']);

    Route::get('/categories', [CourseController::class, 'adminCategories']);
    Route::post('/categories', [CourseController::class, 'storeCategory']);
    Route::put('/categories/{category}', [CourseController::class, 'updateCategory']);
    Route::delete('/categories/{category}', [CourseController::class, 'destroyCategory']);

    Route::get('/instructors', [CourseController::class, 'adminInstructors']);
    Route::post('/instructors', [CourseController::class, 'storeInstructor']);
    Route::put('/instructors/{instructor}', [CourseController::class, 'updateInstructor']);
    Route::delete('/instructors/{instructor}', [CourseController::class, 'destroyInstructor']);

    Route::get('/courses/{course}/schedules', [CourseController::class, 'adminSchedules']);
    Route::post('/courses/{course}/schedules', [CourseController::class, 'storeSchedule']);
    Route::put('/schedules/{schedule}', [CourseController::class, 'updateSchedule']);
    Route::delete('/schedules/{schedule}', [CourseController::class, 'destroySchedule']);

    Route::get('/registrations', [RegistrationController::class, 'adminIndex']);
    Route::put('/registrations/{enrollment}', [RegistrationController::class, 'update']);
    Route::put('/registrations/{enrollment}/attendance', [RegistrationController::class, 'recordAttendance']);

    Route::get('/certificates', [CertificateController::class, 'adminIndex']);
    Route::post('/certificates/{enrollment}', [CertificateController::class, 'issue']);
    Route::delete('/certificates/{certificate}', [CertificateController::class, 'revoke']);
});

Route::middleware('web')
    ->get('/course-images/{course}', [CourseController::class, 'image'])
    ->name('api.course-images.show');

Route::get('/courses/categories', [CourseController::class, 'categories']);
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{slug}', [CourseController::class, 'show']);
Route::get('/instructors', [CourseController::class, 'instructors']);
Route::get('/instructors/{slug}', [CourseController::class, 'instructor']);
Route::get('/schedules', [CourseController::class, 'schedules']);
Route::post('/registrations', [RegistrationController::class, 'store'])->middleware('throttle:10,1');
Route::get('/registrations/{reference}', [RegistrationController::class, 'confirmation']);
Route::post('/certificates/verify', [CertificateController::class, 'verify'])->middleware('throttle:20,1');

Route::get('/about', function () {
    return response()->json([
        'overview' => [
            'introduction' => 'Construction Solutions PLC (CONSOL) is an Ethiopian consulting, training and research institute established in Addis Ababa in 2005.',
            'background' => 'CONSOL works to improve the efficiency and effectiveness of business and public organisations in the construction, telecom, information technology, banking and insurance industries.',
            'purpose' => 'To strengthen organisations and professionals through consulting, training and applied research.',
            'capabilities' => [
                [
                    'title' => 'Construction Management Research & Consultancy Services',
                    'summary' => 'Project Management Office set-up, organisational project management maturity assessment, performance systems and BIM implementation.',
                    'slug' => 'construction-management-consultancy',
                ],
                [
                    'title' => 'Business & Organisational Management Consultancy',
                    'summary' => 'Strategy, feasibility, organisational design, job evaluation and performance management.',
                    'slug' => 'business-management-consultancy',
                ],
                [
                    'title' => 'Training & Certification Services',
                    'summary' => 'Professional training, certification preparation and examination facilitation.',
                    'slug' => 'professional-training',
                ],
                [
                    'title' => 'Research & Industry Development',
                    'summary' => 'Applied sector research, bodies of knowledge, occupational standards and capacity frameworks.',
                    'slug' => 'research-industry-development',
                ],
            ],
        ],
        'milestones' => [
            [
                'year' => '2005',
                'title' => 'CONSOL is founded',
                'text' => 'Construction Solutions PLC is established in Addis Ababa as a consulting, training and research institute.',
            ],
            [
                'year' => '2015',
                'title' => 'Business process and performance systems',
                'text' => 'Business process re-engineering and Balanced Score Card design and implementation for the Government Office Construction Project Office.',
            ],
            [
                'year' => '2017',
                'title' => 'National project management manuals',
                'text' => 'Preparation of the Ethiopian Construction Project Management Manual Series — 19 manuals — for the Ethiopian Construction Management Institute.',
            ],
            [
                'year' => '2018',
                'title' => 'Construction information systems',
                'text' => 'Web-based contractor performance evaluation and construction information management system, after assessing 600+ building projects (2012–2017).',
            ],
            [
                'year' => '2019',
                'title' => 'Competence assessment and certification system',
                'text' => 'Body of knowledge, occupational standards and professionals competence assessment and certification system for engineering and architecture fields.',
            ],
            [
                'year' => '2021',
                'title' => 'Construction Industry Capacity Building Framework',
                'text' => 'Assessment of construction professionals and companies capacity gap, with implementation manual and working systems as per the approved CICBF.',
            ],
            [
                'year' => '2022',
                'title' => 'OPM maturity and Value for Money programmes',
                'text' => 'Organisational project management maturity improvement and a Value for Money assessment across 91 urban local governments under the UIIDP programme.',
            ],
            [
                'year' => '2023',
                'title' => 'Pearson VUE authorized test center',
                'text' => 'CONSOL joins the Pearson VUE network, extending its certification activity to secure international examination delivery.',
            ],
        ],
        'visionMission' => [
            'vision' => 'To be the most recognized Solution Provider for helping companies and professionals become international certified and globally competitive.',
            'mission' => 'To build and grow world-class professionals and companies in the Horn of Africa.',
        ],
        'coreValues' => [],
        'leadership' => [
            [
                'fullName' => 'Martha Zelleke',
                'position' => 'General Manager',
                'biography' => null,
                'professionalBackground' => null,
                'photograph' => null,
            ],
        ],
        'organizationalStructure' => [
            'management' => [
                'title' => 'General Management',
                'support' => 'Supported by the Project Management Office.',
            ],
            'practiceAreas' => [
                [
                    'title' => 'Construction Management Research & Consultancy Services',
                    'summary' => 'PMO set-up, OPM3 maturity assessment, performance-related pay systems, performance monitoring systems and BIM implementation.',
                    'slug' => 'construction-management-consultancy',
                ],
                [
                    'title' => 'Business & Organisational Management Consultancy',
                    'summary' => 'Strategy, feasibility, organisational design, job evaluation, performance management and value-for-money assessment.',
                    'slug' => 'business-management-consultancy',
                ],
                [
                    'title' => 'Training & Certification Services',
                    'summary' => 'Custom-made and scheduled training, PMI® and Autodesk® certification, engineering software and exam facilitation.',
                    'slug' => 'professional-training',
                ],
                [
                    'title' => 'Research & Industry Development',
                    'summary' => 'Bodies of knowledge, occupational standards, capacity frameworks and applied sector research.',
                    'slug' => 'research-industry-development',
                ],
            ],
        ],
        'whyChoose' => [
            [
                'title' => 'Unique consulting approach',
                'summary' => 'By identifying the client’s need, we deliver a result-oriented culture inside the client organisation and provide the desired output.',
            ],
            [
                'title' => 'Tailor-made solutions',
                'summary' => 'We understand the client’s requirements and design the complete company solution accordingly — not a template engagement.',
            ],
            [
                'title' => 'In-depth experience',
                'summary' => 'Our team combines technical and management skills and provides a client-centric solution throughout the consulting engagement.',
            ],
            [
                'title' => 'Accredited delivery',
                'summary' => 'PMI®, Autodesk® and Pearson VUE authorisations mean certification training and testing are delivered to international standards.',
            ],
        ],
    ]);
});

Route::post('/newsletter/subscribe', function (Request $request) {
    $validated = $request->validate([
        'email' => 'required|email',
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Successfully subscribed to CONSOL newsletters.',
    ]);
});
