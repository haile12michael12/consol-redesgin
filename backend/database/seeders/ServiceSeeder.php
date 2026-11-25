<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'slug' => 'construction-management-consultancy',
                'title' => 'Construction Management Consultancy',
                'category' => 'construction-management',
                'summary' => 'PMO set-up, OPM3 maturity assessment, BIM implementation, and contractor performance-related pay structures.',
                'image' => '/media/site-inspection.jpg',
                'image_alt' => 'Civil engineers reviewing drawings on a construction site',
                'scope' => [
                    'Project Management Office (PMO) set-up and consultancy based on the PMI® PMBOK® Guide',
                    'Construction company Enterprise Resource Planning (ERP) system',
                    'Construction project performance related pay (PRP) structure and system',
                    'OPM3 organisational project management maturity assessment',
                    'Web-based contracting parties performance monitoring and evaluation system',
                    'BIM solution implementation',
                ],
                'sort_order' => 1,
            ],
            [
                'slug' => 'business-management-consultancy',
                'title' => 'Business Management Consultancy',
                'category' => 'business-management',
                'summary' => 'Strategy formulation, feasibility studies, project evaluation, organisational structure design, and performance management.',
                'image' => '/media/consultancy.jpg',
                'image_alt' => 'Consultancy team reviewing project documents',
                'scope' => [
                    'Strategy and operational plan',
                    'Feasibility study and Value for Money (VfM) assessment',
                    'Project performance audit and impact assessment',
                    'Organisational structure, job description, specification, and salary scale construction',
                    'Employee performance management system development',
                ],
                'sort_order' => 2,
            ],
            [
                'slug' => 'professional-training',
                'title' => 'Professional Training & Certification',
                'category' => 'training',
                'summary' => 'Accredited PMI® and Autodesk® preparation courses, engineering software training, and Pearson VUE exam administration.',
                'image' => '/media/training.jpg',
                'image_alt' => 'Professional training workshop in progress',
                'scope' => [
                    'PMI® certification preparation — PMP® and CAPM® (Authorized Training Partner)',
                    'Autodesk® certification training — Revit, Civil 3D, Navisworks, BIM 360 (Authorized Training Center)',
                    'Engineering software training — ETABS, SAP, InRoads, WaterCAD, SewerCAD, HEC-RAS',
                    'Pearson VUE authorized test centre examination delivery',
                ],
                'sort_order' => 3,
            ],
            [
                'slug' => 'research-industry-development',
                'title' => 'Research & Industry Development',
                'category' => 'research',
                'summary' => 'Applied research on construction sector performance, capacity building frameworks (CICBF), and occupational standards.',
                'image' => '/media/adama-city.jpg',
                'image_alt' => 'Technical reports and survey data being reviewed',
                'scope' => [
                    'Applied research on construction industry performance and capacity',
                    'Preparation of bodies of knowledge and occupational standards',
                    'Construction Industry Capacity Building Framework (CICBF) implementation manuals',
                    'Feasibility and market studies for industrial and infrastructure investments',
                ],
                'sort_order' => 4,
            ],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(
                ['slug' => $service['slug']],
                $service + [
                    'description' => null,
                    'benefits' => [],
                    'delivery_approach' => null,
                    'related_projects' => [],
                    'faqs' => [],
                    'status' => 'published',
                ],
            );
        }
    }
}
