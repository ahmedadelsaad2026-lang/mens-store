import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import api from './api/axios';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';
import ProductDetails from './pages/ProductDetails';
import Shop from './pages/Shop';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';

// حارس مسار الأدمن
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Home() {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('حدث خطأ في تحميل المنتجات:', err);
        setLoading(false);
      });

    if (token) {
      api.get('/wishlist')
        .then((res) => {
          const ids = res.data.map((item) => item.product_id);
          setWishlistIds(ids);
        })
        .catch(() => {});
    }
  }, [token]);

  const toggleWishlist = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      alert('يرجى تسجيل الدخول أولاً لإضافة المنتج للمفضلة');
      return;
    }

    try {
      const res = await api.post(`/wishlist/toggle/${productId}`);
      if (res.data.status === 'added') {
        setWishlistIds((prev) => [...prev, productId]);
      } else {
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
      }
    } catch (err) {
      alert('تعذر تحديث المفضلة');
    }
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find((img) => img.is_primary);
      return primary ? primary.image_url : product.images[0].image_url;
    }
    return product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category?.slug === activeCategory);

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

  return (
    <div>
      {/* الـ Hero Section */}
      <header className="relative bg-neutral-950 text-white min-h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-45 scale-105">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
            alt="Editorial"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <span className="inline-block uppercase tracking-widest text-[11px] font-bold px-3 py-1 bg-white/10 backdrop-blur-md rounded-full mb-6">
            EDITORIAL COLLECTION 2026 / 2027
          </span>
          <h1 className="text-4xl sm:text-7xl font-black max-w-2xl leading-none tracking-tight mb-6">
            أناقة متجددة بلمسات نقية.
          </h1>
          <p className="text-neutral-300 max-w-lg text-sm sm:text-base mb-8 leading-relaxed">
            قطع موسمية تم اختيارها بعناية لتمنحك حضوراً واثقاً ومظهراً متفرداً بأعلى معايير الخامات الطبيعية.
          </p>
          <div className="flex gap-4">
            <Link
              to="/shop"
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition shadow-xl text-xs"
            >
              استعراض المجموعة الكاملة
            </Link>
            <Link
              to="/my-orders"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition text-xs"
            >
              متابعة طلباتك
            </Link>
          </div>
        </div>
      </header>

      {/* المميزات */}
      <section className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center font-black">✦</span>
            <div>
              <h4 className="text-xs font-black">خامات أوروبية فاخرة</h4>
              <p className="text-[11px] text-neutral-400">قطن وكتان مصري طبيعي 100%</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center font-black">📦</span>
            <div>
              <h4 className="text-xs font-black">معاينة كاملة قبل الاستلام</h4>
              <p className="text-[11px] text-neutral-400">جرّب المقاس وتأكد من الجودة أمام المندوب</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center font-black">⚡</span>
            <div>
              <h4 className="text-xs font-black">توصيل سريع ومباشر</h4>
              <p className="text-[11px] text-neutral-400">شحن موثوق لكافة المدن والمحافظات</p>
            </div>
          </div>
        </div>
      </section>

      {/* قائمة المنتجات */}
      <main id="products" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight">المعروضات الحالية</h2>
            <p className="text-xs text-neutral-400 mt-1">اضغط على أي قطعة لمعاينة معرض صورها واختيار المقاس.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeCategory === cat.id
                    ? 'bg-neutral-950 text-white shadow-sm'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-400">جاري تحميل المنتجات...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed p-8 text-neutral-400">
            لا توجد معروضات متوفرة في هذا القسم حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((item) => {
              const imgUrl = getProductImage(item);
              const hasDiscount = item.discount_price && parseFloat(item.discount_price) > 0;
              const isWished = wishlistIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <Link
                    to={`/product/${item.slug || item.id}`}
                    className="relative overflow-hidden bg-neutral-100 aspect-[4/5] block cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold">
                      {item.category?.name || 'Men'}
                    </div>

                    <button
                      onClick={(e) => toggleWishlist(item.id, e)}
                      className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-90 transition shadow-sm z-10"
                      title={isWished ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                    >
                      <svg
                        className={`w-4 h-4 transition-colors ${
                          isWished ? 'fill-red-600 stroke-red-600' : 'stroke-neutral-700 fill-none'
                        }`}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </Link>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <Link
                        to={`/product/${item.slug || item.id}`}
                        className="font-bold text-neutral-900 text-sm mb-1 block hover:text-neutral-600 transition"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-neutral-400 line-clamp-1 mb-4">{item.description}</p>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-none">السعر</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base font-black text-neutral-950">
                            {hasDiscount ? item.discount_price : item.price} ج.م
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-neutral-400 line-through">
                              {item.price} ج.م
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/product/${item.slug || item.id}`}
                        className="px-4 py-2 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition active:scale-95 shadow-sm"
                      >
                        التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:identifier" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}