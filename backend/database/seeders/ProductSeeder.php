<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'قميص أكسفورد كلاسيك أبيض',
                'description' => 'قميص قطني 100% مناسب للمناسبات الرسمية والعمل.',
                'price' => 450.00,
                'category' => 'shirts',
                'image' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=60',
                'stock' => 15,
            ],
            [
                'name' => 'بدلة رجالي كحلي فاخرة',
                'description' => 'بدلة كاملة بتفصيل عصري وقماش عالي الجودة ومريح.',
                'price' => 2200.00,
                'category' => 'suits',
                'image' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=60',
                'stock' => 8,
            ],
            [
                'name' => 'حذاء كلاسيك جلد طبيعي أسود',
                'description' => 'حذاء أوكسفورد أنيق مريح للمشي الطويل والمناسبات.',
                'price' => 850.00,
                'category' => 'shoes',
                'image' => 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=60',
                'stock' => 12,
            ],
            [
                'name' => 'بنطلون شينو كاجوال زيتي',
                'description' => 'خامة قطنية مرنة ومريحة للاستخدام اليومي والطلعات.',
                'price' => 380.00,
                'category' => 'pants',
                'image' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=60',
                'stock' => 20,
            ],
        ];

        foreach ($products as $item) {
            Product::create($item);
        }
    }
}