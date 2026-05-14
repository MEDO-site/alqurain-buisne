import { useCart } from '@/src/context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { db, auth } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Cart() {
  const { items, total, removeFromCart, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      alert('الرجاء تسجيل الدخول لإتمام الطلب');
      return;
    }

    setCheckingOut(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        items,
        total,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      clearCart();
      setOrderComplete(true);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إتمام الطلب');
    } finally {
      setCheckingOut(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="pt-48 pb-20 text-center px-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-24 h-24 bg-brand-teal/20 text-brand-teal rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand-teal/10">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">تم استلام طلبك بنجاح!</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto">سيقوم فريق المبيعات الفني بمراجعة طلبك والتواصل معك لتأكيد التوصيل.</p>
          <Link to="/shop" className="inline-block bg-brand-teal text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-teal-light transition-all">العودة للمتجر</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-brand-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <header className="mb-12">
          <h2 className="text-xs font-black text-brand-teal tracking-[0.3em] uppercase mb-4">طلباتك</h2>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter flex items-center gap-4">
            عربة <span className="text-brand-teal italic">التسوق</span>
          </h1>
        </header>

        {items.length === 0 ? (
          <div className="bg-brand-card rounded-[50px] p-24 text-center border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 blueprint-pattern opacity-10 pointer-events-none"></div>
            <ShoppingBag className="w-20 h-20 text-gray-800 mx-auto mb-8" />
            <p className="text-gray-500 mb-10 text-lg">عربة التسوق فارغة حالياً، ابدأ بإضافة بعض القطع الفنية.</p>
            <Link to="/shop" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all inline-block">ابدأ التسوق الآن</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-brand-card p-6 rounded-[40px] flex items-center gap-6 border border-white/5 group hover:border-brand-teal/20 transition-all shadow-sm"
                  >
                    <div className="w-24 h-24 bg-black/40 rounded-3xl overflow-hidden shrink-0 border border-white/5">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg tracking-tight mb-1">{item.name}</h4>
                      <p className="text-brand-teal font-black text-sm">{item.price} ر.س</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 bg-white/5 px-4 py-2 rounded-xl">x{item.quantity}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-600 hover:text-red-400 hover:bg-red-400/10 p-3 rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-brand-card p-10 rounded-[50px] border border-white/5 sticky top-32 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 blueprint-pattern opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-10 relative z-10 text-center">ملخص المشتريات</h3>
                
                <div className="space-y-6 text-sm mb-10 pb-10 border-b border-white/5 relative z-10">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">المجموع الفرعي</span>
                    <span className="text-white">{total} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">رسوم التوصيل الفنية</span>
                    <span className="text-brand-teal uppercase tracking-widest text-[10px]">خصم كامل</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-12 relative z-10">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-1">المبلغ الإجمالي</span>
                  <span className="text-4xl font-black text-brand-teal">{total} <span className="text-xs font-normal text-gray-500">ر.س</span></span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-brand-teal hover:bg-brand-teal-light text-black font-black py-6 rounded-2xl shadow-xl shadow-brand-teal/20 transition-all flex items-center justify-center gap-3 group relative z-10 uppercase tracking-widest text-sm"
                >
                  {checkingOut ? 'جاري المعالجة...' : 'إتمام الطلب الآن'}
                  {!checkingOut && <ArrowLeft className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />}
                </button>
                
                <p className="text-[10px] text-gray-600 text-center mt-6 uppercase tracking-widest font-black opacity-50">
                  دفع آمن بالكامل عبر بواباتنا المعتمدة
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
