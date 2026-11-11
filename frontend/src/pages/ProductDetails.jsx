import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ProductDetails() {
  const { identifier } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isWished, setIsWished] = useState(false);
  const [addedAlert, setAddedAlert] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${identifier}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          const primary = res.data.images.find((img) => img.is_primary);
          setSelectedImage(primary ? primary.image_url : res.data.images[0].image_url);
        } else {
          setSelectedImage(res.data.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800');
        }

        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedSize(res.data.variants[0].size);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    const token = localStorage.getItem('token');
    if (token) {
      api.get('/wishlist')
        .then((res) => {
          const found = res.data.some((item) => item.product?.slug === identifier || item.product_id == identifier);
          setIsWished(found);
        })
        .catch(() => {});
    }
  }, [identifier]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('يرجى تسجيل الدخول أولاً لإضافة المنتج للمفضلة');
      return;
    }

    try {
      const res = await api.post(`/wishlist/toggle/${product.id}`);
      setIsWished(res.data.status === 'added');
    } catch (err) {
      alert('تعذر تحديث المفضلة');
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('يرجى اختيار المقاس أولاً');
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartKey = `${product.id}-${selectedSize}`;
    const existingIndex = currentCart.findIndex((item) => item.cartKey === cartKey);

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({
        ...product,
        cartKey,
        selectedSize,
        quantity: 1,
        displayImage: selectedImage,
      });
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('cart-updated'));

    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center font-sans text-neutral-500">
        جاري تحميل تفاصيل المنتج...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-32 text-center font-sans">
        <h2 className="text-xl font-bold">المنتج غير موجود</h2>
        <Link to="/" className="text-xs text-neutral-500 underline mt-2 inline-block">العودة للمتجر</Link>
      </div>
    );
  }

  const hasDiscount = product.discount_price && parseFloat(product.discount_price) > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" dir="rtl">
      {addedAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce">
          ✓ تمت إضافة المنتج إلى سلة المشتريات
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* معرض الصور */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {product.images && product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition flex-shrink-0 ${
                    selectedImage === img.image_url ? 'border-black' : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 bg-neutral-100 rounded-3xl overflow-hidden aspect-[4/5] relative border">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            <button
              onClick={toggleWishlist}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-90 transition shadow-sm"
              title={isWished ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  isWished ? 'fill-red-600 stroke-red-600' : 'stroke-neutral-700 fill-none'
                }`}
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>
        </div>

        {/* تفاصيل المنتج وخيارات الشراء */}
        <div className="flex flex-col justify-center">
          <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-2">
            {product.category?.name || 'MEN'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-black text-black">
              {hasDiscount ? product.discount_price : product.price} ج.م
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-neutral-400 line-through">{product.price} ج.م</span>
                <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">وفر الآن</span>
              </>
            )}
          </div>

          <p className="text-neutral-600 text-sm leading-relaxed mb-8 border-t border-b py-5">
            {product.description}
          </p>

          {/* اختيار المقاسات */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <label className="block text-xs font-bold text-neutral-700 mb-3">المقاس المتاح:</label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`min-w-[48px] h-11 px-3.5 rounded-xl text-xs font-bold border transition ${
                      selectedSize === variant.size
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-neutral-950 hover:bg-neutral-800 text-white py-4 rounded-2xl font-bold transition text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
              </svg>
              إضافة إلى سلة المشتريات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}