<?php

namespace Database\Seeders;

use App\Models\NewsArticle;
use App\Models\NewsCategory;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            ['slug' => 'announcements', 'name' => 'Announcements', 'sort_order' => 1],
            ['slug' => 'consultancy', 'name' => 'Consultancy', 'sort_order' => 2],
            ['slug' => 'training', 'name' => 'Training', 'sort_order' => 3],
        ])->mapWithKeys(fn (array $category) => [
            $category['slug'] => NewsCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            ),
        ]);

        $articles = [
            [
                'slug' => 'pearson-vue-authorized-test-center',
                'title' => 'CONSOL joins the Pearson VUE network as an authorized test center',
                'excerpt' => 'Construction Solutions PLC has become an authorized Pearson VUE test center, delivering internationally recognized certification exams in Addis Ababa under secure conditions.',
                'category' => 'announcements',
                'featured' => true,
                'published_at' => '2023-03-16 00:00:00',
            ],
            [
                'slug' => 'opm-maturity-uiidp-strategic-document',
                'title' => 'OPM maturity improvement programme presented for the UIIDP',
                'excerpt' => 'Under the Urban Institutional & Infrastructure Development Program (UIIDP) supported by the World Bank, CONSOL delivered an implementation manual and strategic document.',
                'category' => 'consultancy',
                'featured' => false,
                'published_at' => '2022-10-27 00:00:00',
            ],
            [
                'slug' => 'pmp-training-ministry-innovation-technology',
                'title' => 'PMI® PMP® training delivered for the Ministry of Innovation & Technology',
                'excerpt' => 'Specialized PMI® PMP® certification training delivered by CONSOL for the Ministry of Innovation & Technology.',
                'category' => 'training',
                'featured' => false,
                'published_at' => '2023-05-10 00:00:00',
            ],
        ];

        foreach ($articles as $article) {
            NewsArticle::query()->updateOrCreate(
                ['slug' => $article['slug']],
                [
                    'news_category_id' => $categories[$article['category']]->id,
                    'title' => $article['title'],
                    'excerpt' => $article['excerpt'],
                    'body' => $article['excerpt'],
                    'featured' => $article['featured'],
                    'status' => 'published',
                    'published_at' => $article['published_at'],
                ],
            );
        }
    }
}
