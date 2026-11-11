import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('خطأ في تحميل المعروضات:', err);
        setLoading(false);
      });
  }, []);

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find((img) => img.is_primary);
      return primary ? primary.image_url : product.images[0].image_url;
    }
    return product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  };

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'shirts', label: 'قمصان' },
    { id: 't-shirts', label: 'تيشيرتات' },
    { id: 'pants', label: 'بنطلونات' },
    { id: 'jeans', label: 'جينز' },
    { id: 'jackets', label: 'جاكيتات وبدل' },
    { id: 'shoes', label: 'أحذية' },
    { id: 'accessories', label: 'إكسسوارات' },
  ];

  // تصفية وترتيب المنتجات ديناميكياً
  const filteredProducts = products
    .filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category?.slug === selectedCategory;
      const currentPrice = p.discount_price ? parseFloat(p.discount_price) : parseFloat(p.price);
      const matchPrice = currentPrice <= maxPrice;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchPrice && matchSearch;
    })
    .sort((a, b) => {
      const priceA = a.discount_price ? parseFloat(a.discount_price) : parseFloat(a.price);
      const priceB = b.discount_price ? parseFloat(b.discount_price) : parseFloat(b.price);
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      return b.id - a.id; // latest
    });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans" dir="rtl">
      {/* النافبار */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-900 text-white rounded-lg flex items-center justify-center font-black text-lg">
              M
            </span>
            <span className="text-2xl font-black tracking-tight text-neutral-900">
              MEN'S <span className="font-light text-neutral-400">STORE</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3.5 py-2 rounded-xl transition">
              المفضلة
            </Link>
            <Link to="/" className="text-xs font-bold bg-neutral-950 text-white hover:bg-neutral-800 px-4 py-2 rounded-xl transition">
              الرئيسية
            </Link>
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">كتالوج المتجر الكامل</h1>
          <p className="text-xs text-neutral-400 mt-1">تصفح وفلتر كامل التشكيلة بالأسعار والأقسام المفضلة لديك.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* الشريط الجانبي للفلترة (Sidebar) */}
          <aside className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-black text-neutral-800 mb-2">البحث بالاسم</label>
              <input
                type="text"
                placeholder="ابحث عن قطعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-black"
              />
            </div>

            {/* الأقسام */}
            <div>
              <label className="block text-xs font-black text-neutral-800 mb-2">القسم</label>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-right px-3 py-2 rounded-xl text-xs font-bold transition flex justify-between items-center ${
                      selectedCategory === cat.id
                        ? 'bg-neutral-950 text-white'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* نطاق السعر */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black text-neutral-800">أقصى سعر:</label>
                <span className="text-xs font-black text-neutral-900">{maxPrice} ج.م</span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-neutral-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>300 ج.م</span>
                <span>3000 ج.م</span>
              </div>
            </div>

            {/* الترتيب */}
            <div className="pt-4 border-t">
              <label className="block text-xs font-black text-neutral-800 mb-2">ترتيب حسب</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-black"
              >
                <option value="latest">الأحدث إضافة</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </aside>

          {/* شبكة المنتجات */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-neutral-500">
                عرض {filteredProducts.length} من أصل {products.length} قطعة
              </span>
            </div>

            {loading ? (
              <div className="text-center py-24 text-neutral-400">جاري تحميل المعروضات...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed p-12 text-center text-neutral-400">
                لا توجد قطع تطابق معايير الفلترة المحددة.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((item) => {
                  const imgUrl = getProductImage(item);
                  const hasDiscount = item.discount_price && parseFloat(item.discount_price) > 0;

                  return (
                    <Link
                      key={item.id}
                      to={`/product/${item.slug || item.id}`}
                      className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                        <img
                          src={imgUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold">
                          {item.category?.name}
                        </div>
                        {hasDiscount && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                            خصم
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="font-bold text-neutral-900 text-sm mb-1 line-clamp-1">{item.name}</h3>
                          <p className="text-xs text-neutral-400 line-clamp-1 mb-3">{item.description}</p>
                        </div>

                        <div className="pt-3 border-t flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-black text-neutral-950">
                              {hasDiscount ? item.discount_price : item.price} ج.م
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-neutral-400 line-through">
                                {item.price} ج.م
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-neutral-800 group-hover:translate-x-[-2px] transition">
                            عرض التفاصيل ←
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}