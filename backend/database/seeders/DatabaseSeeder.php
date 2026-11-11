<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. إنشاء حساب المدير وحساب العميل
        User::updateOrCreate(
            ['email' => 'admin@store.test'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'customer@store.test'],
            [
                'name' => 'Ahmed Adel',
                'password' => Hash::make('password'),
                'role' => 'customer',
            ]
        );

        // 2. إنشاء الأقسام السبعة المحددة في المعمارية
        $categoriesData = [
            ['name' => 'T-shirts', 'slug' => 't-shirts'],
            ['name' => 'Shirts', 'slug' => 'shirts'],
            ['name' => 'Pants', 'slug' => 'pants'],
            ['name' => 'Jeans', 'slug' => 'jeans'],
            ['name' => 'Jackets', 'slug' => 'jackets'],
            ['name' => 'Shoes', 'slug' => 'shoes'],
            ['name' => 'Accessories', 'slug' => 'accessories'],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['slug']] = Category::create($cat);
        }

        // 3. بيانات 24 منتج رجالي فخم مع صور حقيقية وأسعار
        $products = [
            // Shirts
            [
                'name' => 'Oxford Classic White Shirt',
                'category_slug' => 'shirts',
                'price' => 850.00,
                'discount_price' => 750.00,
                'description' => 'قميص أكسفورد كلاسيكي أبيض مصنوع من القطن الطبيعي 100% مناسب لجميع الإطلالات الرسمية والعملية.',
                'image' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Slim Fit Sky Blue Shirt',
                'category_slug' => 'shirts',
                'price' => 890.00,
                'discount_price' => null,
                'description' => 'قميص سليم فيت كلاسيكي سماوي بقصة عصرية وياقة مقواه.',
                'image' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Linen Casual Beige Shirt',
                'category_slug' => 'shirts',
                'price' => 950.00,
                'discount_price' => 820.00,
                'description' => 'قميص كتان بيج صيفي مريح وفضفاض لمظهر كاجوال راقي.',
                'image' => 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Navy Midnight Formal Shirt',
                'category_slug' => 'shirts',
                'price' => 920.00,
                'discount_price' => null,
                'description' => 'قميص كحلي داكن بقماش ناعم مع لمعة خفيفة للأمسيات والمناسبات.',
                'image' => 'https://images.unsplash.com/photo-1620012253295-c15c429f6d3d?w=800&auto=format&fit=crop&q=80',
            ],

            // T-shirts
            [
                'name' => 'Heavyweight Black Crewneck T-Shirt',
                'category_slug' => 't-shirts',
                'price' => 450.00,
                'discount_price' => 390.00,
                'description' => 'تيشيرت أسود بيسك قطن ثقيل عالي المتانة والجودة.',
                'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Pure Cotton White Tee',
                'category_slug' => 't-shirts',
                'price' => 450.00,
                'discount_price' => null,
                'description' => 'تيشيرت أبيض سادة كلاسيكي بقماش قطني بارد ومثالي للارتداء اليومي.',
                'image' => 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Oversized Olive Green Tee',
                'category_slug' => 't-shirts',
                'price' => 520.00,
                'discount_price' => 460.00,
                'description' => 'تيشيرت زيتي أوفر سايز بقصة فضفاضة مريحة تمنحك إطلالة شبابية فريدة.',
                'image' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
            ],

            // Pants
            [
                'name' => 'Tailored Grey Wool Chino',
                'category_slug' => 'pants',
                'price' => 1100.00,
                'discount_price' => 950.00,
                'description' => 'بنطلون شينو كلاسيك رمادي صوف خفيف بقصة سليم تضمن الأناقة المطلقة.',
                'image' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Beige Smart Casual Trousers',
                'category_slug' => 'pants',
                'price' => 980.00,
                'discount_price' => null,
                'description' => 'بنطلون قماش بيج سمارت كاجوال مريح جداً مناسب لبيئة العمل واللقاءات.',
                'image' => 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Slim Fit Navy Chinos',
                'category_slug' => 'pants',
                'price' => 1050.00,
                'discount_price' => 890.00,
                'description' => 'بنطلون شينو كحلي غامق من القطن المطاطي المريح المقاوم للتجعد.',
                'image' => 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
            ],

            // Jeans
            [
                'name' => 'Classic Slim Blue Denim',
                'category_slug' => 'jeans',
                'price' => 1250.00,
                'discount_price' => 1100.00,
                'description' => 'بنطلون جينز أزرق كلاسيكي متين بجودة خياطة استثنائية يدوم طويلاً.',
                'image' => 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Raw Black Selvedge Jeans',
                'category_slug' => 'jeans',
                'price' => 1400.00,
                'discount_price' => null,
                'description' => 'جينز أسود داكن سيلفدج فاخر بقصة مستقيمة مريحة.',
                'image' => 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Vintage Light Wash Jeans',
                'category_slug' => 'jeans',
                'price' => 1180.00,
                'discount_price' => 990.00,
                'description' => 'جينز أزرق فاتح مع غسيل فينتاج كاجوال مميز.',
                'image' => 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop&q=80',
            ],

            // Jackets
            [
                'name' => 'Genuine Leather Biker Jacket',
                'category_slug' => 'jackets',
                'price' => 3200.00,
                'discount_price' => 2850.00,
                'description' => 'جاكيت جلد طبيعي أسود أنيق مع بطانة داخلية دافئة وسحابات معدنية متينة.',
                'image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Italian Wool Navy Blazer',
                'category_slug' => 'jackets',
                'price' => 2800.00,
                'discount_price' => 2400.00,
                'description' => 'بليزر كحلي إيطالي فاخر من الصوف الخالص للمناسبات الرسمية واجتماعات العمل.',
                'image' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Classic Khaki Trench Coat',
                'category_slug' => 'jackets',
                'price' => 2600.00,
                'discount_price' => null,
                'description' => 'معطف ترينش كاكي مقاوم للماء والرياح بتصميم بريطاني عريق.',
                'image' => 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Suede Bomber Jacket',
                'category_slug' => 'jackets',
                'price' => 2200.00,
                'discount_price' => 1950.00,
                'description' => 'جاكيت بومبر شمواه جملي فاخر بلمسة ناعمة وأسلوب عصري لا يتقادم.',
                'image' => 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=80',
            ],

            // Shoes
            [
                'name' => 'Leather Oxford Shoes - Cognac',
                'category_slug' => 'shoes',
                'price' => 1950.00,
                'discount_price' => 1750.00,
                'description' => 'حذاء أكسفورد كلاسيكي من الجلد الطبيعي بلون كونياك ونعل جلدي فاخر.',
                'image' => 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Handcrafted Black Penny Loafers',
                'category_slug' => 'shoes',
                'price' => 1800.00,
                'discount_price' => null,
                'description' => 'لوفر أسود مصنوع يدوياً بجلد طبيعي لامع وراحة فائقة طوال اليوم.',
                'image' => 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Minimalist White Leather Sneakers',
                'category_slug' => 'shoes',
                'price' => 1350.00,
                'discount_price' => 1190.00,
                'description' => 'سنيكرز أبيض ناصع بتصميم مينيماليست فاخر يتناسق مع جميع الإطلالات.',
                'image' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Chelsea Leather Boots - Brown',
                'category_slug' => 'shoes',
                'price' => 2100.00,
                'discount_price' => 1850.00,
                'description' => 'بوت تشيلسي بني من الجلد الطبيعي بنعل مقاوم للانزلاق وسهولة في الارتداء.',
                'image' => 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80',
            ],

            // Accessories
            [
                'name' => 'Full Grain Leather Belt',
                'category_slug' => 'accessories',
                'price' => 490.00,
                'discount_price' => null,
                'description' => 'حزام جلد طبيعي بني متين مع إبزيم معدني كلاسيكي من الستانلس ستيل.',
                'image' => 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Chronograph Black Watch',
                'category_slug' => 'accessories',
                'price' => 2400.00,
                'discount_price' => 2100.00,
                'description' => 'ساعة يد كرونوغراف سوداء بسوار ستانلس فاخر وزجاج مقاوم للخدش.',
                'image' => 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Polarized Classic Sunglasses',
                'category_slug' => 'accessories',
                'price' => 850.00,
                'discount_price' => 690.00,
                'description' => 'نظارة شمسية كلاسيكية بعدسات مستقطبة تحمي من الأشعة فوق البنفسجية.',
                'image' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
            ],
        ];

        // 4. إدخال المنتجات مع الصور والمتغيرات (Variants: Sizes, Colors, Stock)
        $sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        $shoeSizes = ['41', '42', '43', '44', '45'];
        $colors = ['Default', 'Black', 'Navy', 'Brown'];

        foreach ($products as $pData) {
            $category = $categories[$pData['category_slug']];

            $product = Product::create([
                'name' => $pData['name'],
                'slug' => Str::slug($pData['name']) . '-' . rand(100, 999),
                'description' => $pData['description'],
                'price' => $pData['price'],
                'discount_price' => $pData['discount_price'],
                'category_id' => $category->id,
            ]);

            // الصورة الأساسية
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $pData['image'],
                'is_primary' => true,
            ]);

            // صورة ثانوية
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $pData['image'],
                'is_primary' => false,
            ]);

            // إنشاء المتغيرات (Variants) مع مخزون لكل مقاس ولون
            $sizeList = ($pData['category_slug'] === 'shoes') ? $shoeSizes : (($pData['category_slug'] === 'accessories') ? ['One Size'] : $sizes);

            foreach ($sizeList as $size) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'size' => $size,
                    'color' => 'Standard',
                    'stock' => rand(10, 30),
                ]);
            }
        }
    }
}