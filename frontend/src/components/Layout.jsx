import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Layout() {
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user && user.role === 'admin';

  const [checkoutData, setCheckoutData] = useState({
    customer_name: user.name || '',
    customer_phone: '',
    shipping_address: '',
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleCartUpdate = () => {
      const saved = localStorage.getItem('cart');
      setCart(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    if (token) {
      api.get('/wishlist')
        .then((res) => setWishlistCount(res.data.length))
        .catch(() => {});
    }
  }, [token]);

  const updateQuantity = (cartKey, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.cartKey === cartKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartKey) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartKey !== cartKey));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.discount_price ? parseFloat(item.discount_price) : parseFloat(item.price);
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        ...checkoutData,
        items: cart,
        total_price: cartTotal,
      });
      alert(`🎉 تم تأكيد طلبك بنجاح! رقم الطلب: #${res.data.order_id}`);
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      navigate('/my-orders');
    } catch (err) {
      alert(err.response?.data?.message || 'تعذر إتمام الطلب، برجاء المحاولة لاحقاً');
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans flex flex-col justify-between" dir="rtl">
      <div>
        <div className="bg-neutral-950 text-neutral-300 text-xs py-2.5 px-4 text-center font-medium tracking-wide">
          شحن سريع لجميع المحافظات | إمكانية المعاينة والتجربة قبل الدفع
        </div>

        <nav className="bg-white/90 backdrop-blur-md border-b border-neutral-200/80 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 bg-neutral-900 text-white rounded-lg flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
                M
              </span>
              <span className="text-2xl font-black tracking-tight text-neutral-900">
                MEN'S <span className="font-light text-neutral-400">STORE</span>
              </span>
            </Link>

            <div className="flex items-center gap-3 md:gap-5">
              <Link
                to="/shop"
                className="text-xs font-bold bg-neutral-950 text-white hover:bg-neutral-800 px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                المتجر الكامل
              </Link>

              <Link
                to="/my-orders"
                className="text-xs font-bold text-neutral-700 hover:text-black transition"
              >
                طلباتي
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2.5 rounded-xl transition shadow-sm"
                >
                  لوحة الإدارة
                </Link>
              )}

              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-full hover:bg-neutral-100 text-neutral-800 transition"
                title="قائمة الرغبات"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-neutral-100 text-neutral-800 transition"
                title="سلة المشتريات"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-neutral-950 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {token ? (
                <div className="flex items-center gap-3 pr-3 border-r border-neutral-200">
                  <Link to="/profile" className="text-right hover:opacity-80 transition" title="فتح الملف الشخصي">
                    <span className="text-xs font-bold text-neutral-800 block leading-tight">{user.name}</span>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {user.role === 'admin' ? 'مدير المتجر' : 'عميل'}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-semibold text-neutral-600 hover:text-black">دخول</Link>
                  <Link to="/register" className="text-sm font-semibold px-5 py-2.5 bg-black text-white rounded-full hover:bg-neutral-800 transition shadow-sm">انضم إلينا</Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black">سلة المشتريات</h2>
                  <span className="bg-neutral-100 text-neutral-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    {cartCount} قطع
                  </span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-black font-bold text-lg">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 divide-y">
                {cart.length === 0 ? (
                  <div className="text-center py-24 text-neutral-400">سلتك لا تزال فارغة</div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartKey} className="py-4 flex gap-4 items-center">
                      <img src={item.displayImage} alt={item.name} className="w-16 h-20 object-cover rounded-xl bg-neutral-100 border" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-neutral-800 line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                          <span>{item.discount_price || item.price} ج.م</span>
                          <span>•</span>
                          <span className="font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">مقاس {item.selectedSize}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button onClick={() => updateQuantity(item.cartKey, -1)} className="w-7 h-7 border rounded-lg flex items-center justify-center text-xs font-bold hover:bg-neutral-100">-</button>
                          <span className="text-xs font-bold px-2">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartKey, 1)} className="w-7 h-7 border rounded-lg flex items-center justify-center text-xs font-bold hover:bg-neutral-100">+</button>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-black">
                          {((item.discount_price || item.price) * item.quantity).toFixed(2)} ج.م
                        </p>
                        <button onClick={() => removeFromCart(item.cartKey)} className="text-[11px] text-red-500 hover:text-red-700 mt-3 font-semibold block">إزالة</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t bg-neutral-50">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-sm text-neutral-500 font-semibold">المبلغ الإجمالي</span>
                    <span className="text-2xl font-black text-black">{cartTotal.toFixed(2)} ج.م</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-4 rounded-2xl font-bold transition text-sm shadow-md"
                  >
                    متابعة عملية الشراء
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute left-5 top-5 text-neutral-400 hover:text-black font-bold text-lg">✕</button>
            <h3 className="text-2xl font-black mb-1">تفاصيل الشحن والتوصيل</h3>
            <p className="text-xs text-neutral-400 mb-6">يرجى التأكد من كتابة العنوان ورقم الهاتف بدقة.</p>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">الاسم ثلاثي</label>
                <input
                  type="text"
                  required
                  value={checkoutData.customer_name}
                  onChange={(e) => setCheckoutData({ ...checkoutData, customer_name: e.target.value })}
                  className="w-full p-3 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition"
                  placeholder="محمد أحمد عبد الرحمن"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">رقم الهاتف المحمول</label>
                <input
                  type="tel"
                  required
                  value={checkoutData.customer_phone}
                  onChange={(e) => setCheckoutData({ ...checkoutData, customer_phone: e.target.value })}
                  className="w-full p-3 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition"
                  placeholder="010xxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">عنوان التوصيل بالتفصيل</label>
                <textarea
                  required
                  rows="3"
                  value={checkoutData.shipping_address}
                  onChange={(e) => setCheckoutData({ ...checkoutData, shipping_address: e.target.value })}
                  className="w-full p-3 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition resize-none"
                  placeholder="المحافظة، الحي، اسم الشارع، رقم العقار"
                />
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl flex justify-between items-center border">
                <span className="font-bold text-xs text-neutral-600">المبلغ النهائي عند الاستلام:</span>
                <span className="font-black text-xl text-black">{cartTotal.toFixed(2)} ج.م</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white py-4 rounded-2xl font-bold transition text-sm shadow-md"
              >
                {submitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-neutral-950 text-white py-12 mt-20 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-black">MEN'S STORE</div>
          <p className="text-xs text-neutral-500">© 2026 جميع الحقوق محفوظة لمتجر Men's Store.</p>
        </div>
      </footer>
    </div>
  );
}