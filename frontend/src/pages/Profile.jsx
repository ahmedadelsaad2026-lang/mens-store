import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    new_password: '',
  });
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.get('/user')
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          name: res.data.name || '',
          email: res.data.email || '',
        }));
        setRole(res.data.role || 'customer');
        setLoading(false);
      })
      .catch(() => {
        localStorage.clear();
        navigate('/login');
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/user/profile', formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage({ type: 'success', text: 'تم تحديث بيانات حسابك بنجاح ✅' });
      setFormData((prev) => ({ ...prev, current_password: '', new_password: '' }));
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'حدث خطأ أثناء حفظ البيانات',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center font-sans text-neutral-500">
        جاري تحميل بيانات الحساب...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans" dir="rtl">
      {/* شريط علوي بسيط */}
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-950 text-white rounded-lg flex items-center justify-center font-black">M</span>
            <span className="font-black text-lg">MEN'S STORE</span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-bold">
            <Link to="/my-orders" className="text-neutral-600 hover:text-black">طلباتي</Link>
            <Link to="/" className="text-neutral-600 hover:text-black">الرئيسية</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border p-8 md:p-10 shadow-sm">
          <div className="flex items-center justify-between border-b pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-black">الملف الشخصي</h1>
              <p className="text-xs text-neutral-400 mt-1">عرض وتحديث بياناتك الشخصية وكلمة المرور</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-neutral-100 rounded-full text-neutral-600">
              {role === 'admin' ? 'مدير المتجر' : 'عميل'}
            </span>
          </div>

          {message.text && (
            <div
              className={`p-4 rounded-xl text-xs font-bold mb-6 border ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-red-50 text-red-600 border-red-100'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">الاسم بالكامل</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3.5 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3.5 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition"
              />
            </div>

            <div className="border-t pt-5 mt-6">
              <h3 className="text-sm font-black mb-3 text-neutral-800">تغيير كلمة المرور (اختياري)</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    value={formData.current_password}
                    onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                    className="w-full p-3.5 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    className="w-full p-3.5 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition"
                    placeholder="6 أحرف على الأقل"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white py-3.5 rounded-xl font-bold transition text-xs shadow-md"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
              <Link
                to="/my-orders"
                className="px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold transition text-xs flex items-center justify-center"
              >
                سجل طلباتي
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}