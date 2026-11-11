import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // توجيه ذكي حسب الرول
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center p-6 text-neutral-900 font-sans" dir="rtl">
      <div className="bg-white p-8 md:p-10 rounded-3xl border shadow-sm w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-neutral-950 text-white rounded-lg flex items-center justify-center font-black">M</span>
            <span className="text-xl font-black">MEN'S STORE</span>
          </Link>
          <h2 className="text-2xl font-black">تسجيل الدخول</h2>
          <p className="text-xs text-neutral-400 mt-1">أهلاً بك مجدداً، أدخل بياناتك للمتابعة</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl mb-4 font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white py-4 rounded-xl font-bold transition text-sm shadow-md"
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 mt-6">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-neutral-950 font-bold underline">
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
    </div>
  );
}