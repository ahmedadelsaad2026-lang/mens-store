import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get('/user/orders')
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('تعذر جلب الطلبات:', err);
        setLoading(false);
      });
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة والتدقيق';
      case 'processing': return 'جاري تجهيز وتغليف الطلب';
      case 'shipped': return 'في الطريق إليك مع شركة الشحن';
      case 'delivered': return 'تم التوصيل بنجاح';
      case 'cancelled': return 'طلب ملغي';
      default: return status;
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-neutral-900 font-sans" dir="rtl">
      {/* النافبار */}
      <nav className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-950 text-white rounded-lg flex items-center justify-center font-black text-lg">
              M
            </span>
            <span className="text-xl font-black tracking-tight">
              MEN'S <span className="font-light text-neutral-400">STORE</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="text-xs font-bold text-neutral-600 hover:text-black">المفضلة</Link>
            <Link to="/" className="text-xs font-bold bg-neutral-950 text-white hover:bg-neutral-800 px-4 py-2 rounded-xl transition">
              ← العودة للمتجر
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold block mb-1">حسابي</span>
          <h1 className="text-3xl font-black tracking-tight">سجل الطلبات والمتابعة</h1>
          <p className="text-xs text-neutral-400 mt-1">تتبع مسار شحن مشترياتك وتاريخ طلباتك السابقة.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm">جاري جلب بيانات طلباتك...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed p-16 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
              </svg>
            </div>
            <h3 className="font-bold text-base mb-1">لا توجد طلبات مسجلة باسمك بعد</h3>
            <p className="text-xs text-neutral-400 mb-6">تصفح تشكيلة الموسم الحالي وأكد طلبك الأول مع خيار المعاينة قبل الدفع.</p>
            <Link to="/shop" className="inline-block px-6 py-3 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition">
              استكشف المتجر الآن
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getStatusStep(order.status);
              const isCancelled = order.status === 'cancelled';

              return (
                <div key={order.id} className="bg-white border rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-lg">طلب #{order.id}</span>
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 mt-1 block">
                        تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-EG', { dateStyle: 'long' })}
                      </span>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-xs text-neutral-400 block">إجمالي الفاتورة عند الاستلام</span>
                      <span className="text-xl font-black text-neutral-950">{parseFloat(order.total_price).toFixed(2)} ج.م</span>
                    </div>
                  </div>

                  {/* شريط مراحل الشحن العالمي (Timeline Progress) */}
                  {!isCancelled && (
                    <div className="py-6 border-b">
                      <div className="grid grid-cols-4 text-center text-[11px] font-bold text-neutral-400 mb-2">
                        <span className={currentStep >= 1 ? 'text-neutral-950' : ''}>تم الاستلام</span>
                        <span className={currentStep >= 2 ? 'text-neutral-950' : ''}>التجهيز</span>
                        <span className={currentStep >= 3 ? 'text-neutral-950' : ''}>مع المندوب</span>
                        <span className={currentStep >= 4 ? 'text-emerald-600' : ''}>تم التسليم</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-neutral-950 h-full transition-all duration-500 rounded-full"
                          style={{ width: `${(currentStep / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-6 flex flex-col md:flex-row justify-between gap-6 text-xs text-neutral-600">
                    <div>
                      <span className="font-bold text-neutral-800 block mb-1">عنوان الشحن:</span>
                      <p className="text-neutral-500">{order.shipping_address}</p>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-800 block mb-1">رقم التواصل:</span>
                      <p className="font-sans text-neutral-500">{order.customer_phone}</p>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-800 block mb-1">القطع:</span>
                      <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-bold">
                        {order.items ? `${order.items.length} قطع` : '—'}
                      </span>
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