import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    api.get('/wishlist')
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('خطأ في تحميل المفضلة:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (productId) => {
    try {
      await api.post(`/wishlist/toggle/${productId}`);
      setItems((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      alert('حدث خطأ أثناء إزالة المنتج');
    }
  };

  const getProductImage = (product) => {
    if (product?.images && product.images.length > 0) {
      const primary = product.images.find((img) => img.is_primary);
      return primary ? primary.image_url : product.images[0].image_url;
    }
    return product?.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans" dir="rtl">
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
          <Link
            to="/"
            className="text-sm font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded-xl transition"
          >
            ← العودة للمتجر
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black">قائمة الرغبات والمفضلات</h1>
          <p className="text-sm text-neutral-400 mt-2">القطع التي قمت بحفظها للرجوع إليها لاحقاً.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-400">جاري تحميل المفضلة...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed p-8">
            <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <h3 className="text-lg font-bold mb-2">قائمتك فارغة تماماً</h3>
            <p className="text-xs text-neutral-400 mb-6">تصفح المعروضات واضغط على أيقونة القلب لحفظ القطع المفضلة لديك.</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-neutral-950 text-white font-bold rounded-xl text-xs hover:bg-neutral-800 transition"
            >
              استكشف المتجر الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              const imgUrl = getProductImage(product);
              const hasDiscount = product.discount_price && parseFloat(product.discount_price) > 0;

              return (
                <div key={item.id} className="bg-white rounded-2xl border overflow-hidden flex flex-col justify-between group">
                  <div className="relative aspect-[4/5] bg-neutral-100">
                    <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 hover:scale-110 transition shadow-sm"
                      title="إزالة من المفضلة"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">{product.category?.name}</span>
                      <h3 className="font-bold text-neutral-900 text-sm mt-1 mb-2 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-neutral-950">
                          {hasDiscount ? product.discount_price : product.price} ج.م
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-neutral-400 line-through">{product.price} ج.م</span>
                        )}
                      </div>
                    </div>
                    <Link
                      to="/"
                      className="mt-4 w-full py-2.5 bg-neutral-950 text-white text-center rounded-xl font-bold text-xs hover:bg-neutral-800 transition"
                    >
                      عرض في المتجر
                    </Link>
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