<?php

namespace Database\Seeders;

use App\Enums\ContentStatus;
use App\Models\Project;
use App\Models\ProjectCategory;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $categoryNames = [
            'construction-management' => 'Construction management',
            'business-management' => 'Business management',
            'capacity-development' => 'Capacity development',
            'research' => 'Research & assessment',
        ];

        foreach (array_keys($categoryNames) as $sortOrder => $slug) {
            ProjectCategory::query()->firstOrCreate(
                ['slug' => $slug],
                ['name' => $categoryNames[$slug], 'sort_order' => $sortOrder],
            );
        }

        $projects = [
            [
                'slug' => 'opm-maturity-improvement-construction-industry',
                'title' => 'Organisational Project Management (OPM) maturity improvement in the construction industry',
                'category' => 'construction-management',
                'client' => 'Ministry of Urban & Infrastructure, UIIDP Program (World Bank funded project)',
                'location' => 'Federal programme, Ethiopia',
                'year' => 2022,
                'featured' => true,
                'summary' => 'Preparation of an implementation manual, training delivery and formulation of a strategic document for implementing Organisational Project Management maturity improvement in organisations that conduct construction projects.',
                'scope' => [
                    'Preparation of an implementation manual for OPM maturity improvement',
                    'Training delivery, including OPM3 assessor training in Bahir Dar (October 2022)',
                    'Formulation of a strategic document for implementation across participating organisations',
                ],
                'services' => ['OPM3 maturity assessment', 'Strategic documentation', 'Trainer and assessor development'],
            ],
            [
                'slug' => 'professional-competence-assessment-certification-system',
                'title' => 'Professionals competence assessment and certification system for engineering, architecture and related fields',
                'category' => 'capacity-development',
                'client' => 'Ethiopian Construction Management Institute',
                'location' => 'National',
                'year' => 2019,
                'featured' => true,
                'summary' => 'Preparation of a body of knowledge, occupational standards and a professionals competence assessment and certification system.',
                'scope' => [
                    'Preparation of the occupational body of knowledge',
                    'Development of occupational standards',
                    'Design of the competence assessment and certification system',
                ],
                'services' => ['Competency frameworks', 'Occupational standards', 'Certification system design'],
            ],
            [
                'slug' => 'ethiopian-construction-project-management-manuals',
                'title' => 'Ethiopian Construction Project Management Manual Series (ECP-MMS)',
                'category' => 'construction-management',
                'client' => 'Ethiopian Construction Management Institute',
                'location' => 'National',
                'year' => 2017,
                'featured' => true,
                'summary' => 'Consultancy service for the preparation of the Ethiopian Construction Project Management Manual Series — 19 manuals.',
                'scope' => [
                    'Authoring of 19 project management manuals',
                    'Alignment with national construction project management practice',
                    'Consultation and review with the client institute',
                ],
                'services' => ['Manual development', 'Process documentation', 'Technical authorship'],
            ],
            [
                'slug' => 'value-for-money-assessment-uiidp',
                'title' => 'Value for Money (VfM) assessment of capital investments for EFY 2013',
                'category' => 'business-management',
                'client' => 'Ministry of Urban & Infrastructure, UIIDP Program (World Bank funded project)',
                'location' => '91 urban local governments, all regions',
                'year' => 2022,
                'summary' => 'Full technical and financial review of various activities and contracts, and an assessment of the quality of infrastructure of capital investments for EFY 2013 (2020/21) across 91 urban local governments participating in UIIDP.',
                'scope' => [
                    'Technical and financial review of contracts',
                    'Assessment of infrastructure quality of capital investments',
                    'Coverage across 91 urban local governments in all regions',
                ],
                'services' => ['Value for money assessment', 'Technical audit', 'Financial review'],
            ],
            [
                'slug' => 'business-process-reengineering-balanced-scorecard',
                'title' => 'Business process re-engineering (BPR) and Balanced Score Card (BSC) design and implementation',
                'category' => 'business-management',
                'client' => 'Ministry of Urban Development, Housing & Construction — Government Office Construction Project Office',
                'location' => 'Addis Ababa',
                'year' => 2015,
                'summary' => 'Consultancy service to redesign business processes and design and implement a Balanced Score Card system.',
                'scope' => [
                    'Business process re-engineering',
                    'Balanced Score Card design',
                    'Implementation support',
                ],
                'services' => ['Business process re-engineering', 'Performance management', 'Implementation support'],
            ],
            [
                'slug' => 'civil-engineering-education-employment-review',
                'title' => 'Reviewing the quality of civil engineering education and employment opportunities for civil engineers in Ethiopia',
                'category' => 'research',
                'client' => 'Ethiopian Association of Civil Engineers (EACE)',
                'location' => 'National',
                'year' => 2017,
                'summary' => 'Assessment of the quality of education and employment opportunities for civil engineering graduates, with a final presentation in July 2017.',
                'scope' => [
                    'Review of civil engineering education quality',
                    'Assessment of employment opportunities for graduates',
                    'Final presentation to the client association (July 2017)',
                ],
                'services' => ['Applied research', 'Labour-market assessment', 'Education quality review'],
            ],
            [
                'slug' => 'performance-related-pay-system-teklebrhan-ambaye',
                'title' => 'Design and implementation of an effective project performance related pay (PRP) system',
                'category' => 'business-management',
                'client' => 'Teklebrhan Ambaye Construction PLC',
                'location' => 'Ethiopia',
                'year' => 2017,
                'summary' => 'Consultancy service to design and implement an effective project performance related pay system for a private construction contractor.',
                'scope' => [
                    'Design of the performance related pay system',
                    'Implementation support inside the contracting organisation',
                    'Performance measurement criteria',
                ],
                'services' => ['Performance related pay', 'Compensation design', 'Implementation support'],
            ],
            [
                'slug' => 'capacity-gap-assessment-cicbf',
                'title' => 'Assessment of construction professionals and companies capacity gap under the Construction Industry Capacity Building Framework',
                'category' => 'capacity-development',
                'client' => 'Construction Management Institute',
                'location' => 'National',
                'year' => 2021,
                'summary' => 'Assessment of the capacity gap of contractors, consultants, employers, SMEs and professionals, and development of an implementation manual and working systems as per the approved CICBF.',
                'scope' => [
                    'Capacity gap assessment across contractor, consultant, employer and SME segments',
                    'Development of an implementation manual',
                    'Design of working systems aligned to the approved CICBF',
                ],
                'services' => ['Capacity assessment', 'Framework development', 'Working systems design'],
            ],
            [
                'slug' => 'contractor-performance-evaluation-information-system',
                'title' => 'Web-based contractor performance evaluation and construction information management system',
                'category' => 'construction-management',
                'client' => 'SNNPRS South Construction Bureau',
                'location' => 'Southern Nations, Nationalities and Peoples Regional State',
                'year' => 2018,
                'summary' => 'Assessment of more than 600 completed and ongoing building projects (2012–2017) and delivery of a web-based contractor performance evaluation and construction information management system.',
                'scope' => [
                    'Assessment of 600+ building projects (2012–2017)',
                    'Web-based contractor performance evaluation system',
                    'Construction information management system',
                    'Final presentation May 2018',
                ],
                'services' => ['Project performance assessment', 'Information system design', 'Data collection at scale'],
            ],
            [
                'slug' => 'defence-enterprises-organisational-structure',
                'title' => 'Organisational structure, job grading, evaluation and financial analysis',
                'category' => 'business-management',
                'client' => 'Defense Design Enterprise, Defense Construction Enterprise, Defense Construction Material Manufacturing Enterprise',
                'location' => 'Ethiopia',
                'year' => 2019,
                'summary' => 'Preparation of organisational structure, job grading and evaluation, and financial analysis for three defence-sector enterprises.',
                'scope' => ['Organisational structure design', 'Job grading and evaluation', 'Financial analysis'],
                'services' => ['Organisational design', 'Job evaluation', 'Financial analysis'],
            ],
            [
                'slug' => 'feasibility-study-army-shoe-canned-food-factory',
                'title' => 'Feasibility study — Army shoe and canned food factory',
                'category' => 'business-management',
                'client' => 'Defence Army Foundation',
                'location' => 'Ethiopia',
                'year' => 2021,
                'summary' => 'Feasibility study for the establishment of an army shoe production and canned food factory.',
                'scope' => ['Market and technical feasibility', 'Financial modelling', 'Investment recommendation'],
                'services' => ['Feasibility study', 'Financial analysis', 'Industrial planning'],
            ],
            [
                'slug' => 'pmi-pmp-master-framework-agreement',
                'title' => 'PMI® PMP® training and exam facilitation — two-year Master Framework Agreement',
                'category' => 'capacity-development',
                'client' => 'Construction Management Institute',
                'location' => 'Ethiopia',
                'year' => 2023,
                'summary' => 'Delivery of PMI® PMP® training and exam facilitation under a two-year Master Framework Agreement (2023–2024). 200 professionals were trained in the first year and exams were facilitated for 90 candidates at the time of publication.',
                'scope' => [
                    'PMI® PMP® training delivery',
                    'Examination facilitation',
                    'Delivery to construction industry professionals',
                ],
                'services' => ['Certification training', 'Exam facilitation', 'Programme management'],
            ],
        ];

        foreach ($projects as $data) {
            $category = ProjectCategory::query()->where('slug', $data['category'])->firstOrFail();
            unset($data['category']);
            $client = $data['client'] ?? null;
            $location = $data['location'] ?? null;
            $data['client_approved'] = $client !== null;
            $data['location_approved'] = $location !== null;
            $data['overview'] = $data['summary'];
            $data['status'] = ContentStatus::Published->value;
            $data['outcomes'] = [];

            $project = Project::query()->firstOrCreate(
                ['slug' => $data['slug']],
                $data,
            );
            $project->categories()->syncWithoutDetaching([$category->id]);
        }
    }
}
