import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [updatingId, setUpdatingId] = useState(null);

  // حالة نموذج إضافة منتج جديد
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: '1',
    price: '',
    discount_price: '',
    description: '',
    image: '',
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // حالة نافذة تعديل المنتج
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ price: '', discount_price: '', name: '' });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/products'),
      ]);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);

      const cats = [];
      const seen = new Set();
      (productsRes.data || []).forEach((p) => {
        if (p.category && !seen.has(p.category.id)) {
          seen.add(p.category.id);
          cats.push(p.category);
        }
      });
      setCategories(cats.length > 0 ? cats : [
        { id: 1, name: 'Shirts' },
        { id: 2, name: 'T-Shirts' },
        { id: 3, name: 'Pants' },
        { id: 4, name: 'Jeans' },
        { id: 5, name: 'Jackets' },
        { id: 6, name: 'Shoes' },
        { id: 7, name: 'Accessories' },
      ]);
    } catch (err) {
      console.error('خطأ في جلب بيانات لوحة التحكم:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('تعذر تحديث حالة الطلب');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmittingProduct(true);
    try {
      const res = await api.post('/admin/products', newProduct);
      alert('🎉 تم إضافة المنتج بنجاح وإتاحته في المتجر!');
      setProducts((prev) => [res.data, ...prev]);
      setNewProduct({
        name: '',
        category_id: categories[0]?.id || '1',
        price: '',
        discount_price: '',
        description: '',
        image: '',
      });
    } catch (err) {
      alert(err.response?.data?.message || 'تعذر إضافة المنتج، تأكد من ملء الحقول المطلوبة');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف المنتج: "${name}" نهائياً من المتجر؟`)) {
      return;
    }

    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert('تم حذف المنتج بنجاح');
    } catch (err) {
      alert('حدث خطأ أثناء محاولة حذف المنتج');
    }
  };

  // فتح نافذة التعديل
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price,
      discount_price: product.discount_price || '',
    });
  };

  // حفظ التعديلات
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setSubmittingEdit(true);
    try {
      const res = await api.put(`/admin/products/${editingProduct.id}`, editFormData);
      alert('تم تعديل بيانات المنتج بنجاح!');
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...res.data.product } : p))
      );
      setEditingProduct(null);
    } catch (err) {
      alert('تعذر حفظ التعديلات');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">قيد المراجعة</span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">قيد التجهيز</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">جاري الشحن</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">تم التسليم</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">ملغي</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans" dir="rtl">
      {/* الشريط العلوي */}
      <header className="bg-neutral-950 text-white sticky top-0 z-40 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-white text-black font-black rounded-lg flex items-center justify-center text-lg">
              A
            </span>
            <div>
              <h1 className="text-lg font-black leading-tight">لوحة تحكم المتجر (Admin)</h1>
              <p className="text-[11px] text-neutral-400">إدارة المنتجات، متابعة الطلبات، والمبيعات</p>
            </div>
          </div>
          <Link
            to="/"
            className="text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2.5 rounded-xl transition"
          >
            ← الذهاب للمتجر
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* بطاقات الإحصائيات */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-neutral-400">إجمالي المبيعات النشطة</span>
            <div className="mt-3">
              <span className="text-3xl font-black text-neutral-950">{totalSales.toFixed(2)}</span>
              <span className="text-xs font-bold text-neutral-400 mr-2">ج.م</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-neutral-400">إجمالي الطلبات (الجديدة)</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-neutral-950">{orders.length}</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {pendingOrdersCount} قيد المراجعة
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-neutral-400">المنتجات المعروضة</span>
            <div className="mt-3">
              <span className="text-3xl font-black text-neutral-950">{products.length}</span>
              <span className="text-xs font-bold text-neutral-400 mr-2">منتج</span>
            </div>
          </div>
        </section>

        {/* التبويبات */}
        <div className="border-b border-neutral-200 flex gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-black transition border-b-2 ${
              activeTab === 'orders'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            الطلبات الواردة ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-black transition border-b-2 ${
              activeTab === 'products'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            إدارة المعروضات ({products.length})
          </button>
        </div>

        {/* جدول الطلبات */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-neutral-400 text-sm">جاري تحميل بيانات الطلبات...</div>
            ) : orders.length === 0 ? (
              <div className="p-16 text-center text-neutral-400">
                <p className="text-base font-bold mb-1">لا توجد طلبات جديدة واردة حتى الآن.</p>
                <p className="text-xs text-neutral-400">قم بعمل طلب تجريبي من واجهة المتجر وسيظهر هنا مباشرة.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-neutral-50 text-neutral-500 font-bold border-b">
                    <tr>
                      <th className="p-4">رقم الطلب</th>
                      <th className="p-4">العميل والهاتف</th>
                      <th className="p-4">عنوان التوصيل</th>
                      <th className="p-4">عدد القطع</th>
                      <th className="p-4">الإجمالي</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">تعديل الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-neutral-50/60 transition">
                        <td className="p-4 font-black text-neutral-950">#{o.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-neutral-900">{o.customer_name}</div>
                          <div className="text-[11px] text-neutral-400 font-sans mt-0.5">{o.customer_phone}</div>
                        </td>
                        <td className="p-4 text-neutral-600 max-w-xs">{o.shipping_address}</td>
                        <td className="p-4 text-neutral-700 font-bold">
                          {o.items ? `${o.items.length} قطع` : '—'}
                        </td>
                        <td className="p-4 font-black text-neutral-950 text-sm">
                          {parseFloat(o.total_price).toFixed(2)} ج.م
                        </td>
                        <td className="p-4">{getStatusBadge(o.status)}</td>
                        <td className="p-4">
                          <select
                            disabled={updatingId === o.id}
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="p-2 bg-neutral-50 border rounded-xl font-bold text-neutral-800 text-xs focus:outline-none focus:border-black cursor-pointer"
                          >
                            <option value="pending">قيد المراجعة</option>
                            <option value="processing">قيد التجهيز</option>
                            <option value="shipped">جاري الشحن</option>
                            <option value="delivered">تم التسليم</option>
                            <option value="cancelled">إلغاء الطلب</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* إدارة المنتجات (إضافة + تعديل + حذف) */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* نموذج إضافة منتج جديد */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm">
              <h3 className="text-lg font-black mb-1">إضافة منتج جديد للمتجر</h3>
              <p className="text-xs text-neutral-400 mb-6">سيتم إنشاء الـ slug وتوليد المقاسات القياسية وحفظ الصورة تلقائياً.</p>

              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-black"
                    placeholder="مثال: Cotton Linen Navy Shirt"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">القسم</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs font-bold focus:outline-none focus:border-black cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">رابط الصورة (URL)</label>
                  <input
                    type="url"
                    required
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-black"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">السعر الأساسي (ج.م)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-black"
                    placeholder="850.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">سعر الخصم (اختياري)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.discount_price}
                    onChange={(e) => setNewProduct({ ...newProduct, discount_price: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-black"
                    placeholder="690.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">وصف المنتج</label>
                  <input
                    type="text"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-black"
                    placeholder="وصف مختصر للقطعة والخامة"
                  />
                </div>

                <div className="md:col-span-3 pt-2">
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="px-6 py-3 bg-neutral-950 text-white font-bold rounded-xl text-xs hover:bg-neutral-800 transition shadow-sm disabled:bg-neutral-400"
                  >
                    {submittingProduct ? 'جاري الإضافة...' : '+ إضافة المنتج للكتالوج الآن'}
                  </button>
                </div>
              </form>
            </div>

            {/* بطاقات المعروضات الحالية مع أزرار التعديل والحذف */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6">
              <h4 className="text-sm font-black mb-6">قائمة المعروضات ({products.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => {
                  const hasDiscount = p.discount_price && parseFloat(p.discount_price) > 0;
                  return (
                    <div key={p.id} className="p-4 border rounded-2xl flex flex-col justify-between bg-neutral-50/50 hover:bg-white hover:shadow-md transition">
                      <div className="flex items-start gap-3">
                        <img
                          src={p.images?.[0]?.image_url || p.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                          alt={p.name}
                          className="w-16 h-20 object-cover rounded-xl bg-neutral-100 border shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase text-neutral-400">{p.category?.name}</span>
                          <h4 className="font-bold text-xs truncate text-neutral-900 mt-0.5">{p.name}</h4>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-xs font-black text-neutral-950">
                              {hasDiscount ? p.discount_price : p.price} ج.م
                            </span>
                            {hasDiscount && (
                              <span className="text-[10px] text-neutral-400 line-through">
                                {p.price} ج.م
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* أزرار الإجراءات (تعديل وحذف) */}
                      <div className="pt-4 mt-4 border-t flex gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="flex-1 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 transition"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* نافذة التعديل المنبثقة (Modal) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute left-5 top-5 text-neutral-400 hover:text-black font-bold text-base"
            >
              ✕
            </button>
            <h3 className="text-lg font-black mb-1">تعديل بيانات المنتج</h3>
            <p className="text-xs text-neutral-400 mb-6">تحديث السعر وسعر الخصم والاسم فورياً.</p>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">السعر الأساسي (ج.م)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">سعر الخصم (ج.م)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.discount_price}
                  onChange={(e) => setEditFormData({ ...editFormData, discount_price: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl text-xs focus:outline-none focus:border-black"
                  placeholder="اتركه فارغاً لإلغاء الخصم"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="flex-1 py-3 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition"
                >
                  {submittingEdit ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-3 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-200 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}