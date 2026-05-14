import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Phone, User, MessageSquare, Wrench, CheckCircle2 } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Link } from 'react-router-dom';

export default function Booking() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'ac_maintenance',
    date: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || prev.name,
        phone: profile.phone || prev.phone,
        address: profile.address || prev.address
      }));
    }
  }, [profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const bookingData = {
        ...formData,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous',
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'maintenance'), bookingData);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'maintenance');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-48 pb-20 bg-brand-bg min-h-screen text-center px-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-24 h-24 bg-brand-teal/20 text-brand-teal rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand-teal/10">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">تم استلام طلب الصيانة!</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto">سيتواصل معك مهندسنا الفني خلال 30 دقيقة لتأكيد الموعد النهائي وجدول الزيارة.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dashboard" className="bg-brand-teal text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-teal-light transition-all">تتبع الطلب في لوحة التحكم</Link>
            <Link to="/" className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-bold text-xs hover:bg-white/10 transition-all">العودة للرئيسية</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-brand-bg min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 px-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center p-4 bg-brand-teal rounded-[32px] text-black mb-8 shadow-xl shadow-brand-teal/20"
          >
            <Wrench className="w-8 h-8" />
          </motion.div>
          <h2 className="text-xs font-black text-brand-teal tracking-[0.3em] uppercase mb-4">مركز الصيانة</h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">احجز <span className="text-brand-teal italic">زيارة فنية</span></h1>
          <p className="text-gray-500 max-w-lg mx-auto">نحن ندرك أهمية وقتك، لذا نلتزم بمواعيدنا لتقديم أفضل خدمة فنية ممكنة.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-card rounded-[50px] shadow-2xl border border-white/5 overflow-hidden relative group"
        >
          <div className="absolute inset-0 blueprint-pattern opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>
          
          <form onSubmit={handleSubmit} className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                <User className="w-3 h-3 text-brand-teal" />
                الاسم بالكامل
              </label>
              <input
                required
                type="text"
                placeholder="أدخل اسمك"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                <Phone className="w-3 h-3 text-brand-teal" />
                رقم الجوال بالكويت
              </label>
              <input
                required
                type="tel"
                placeholder="05xxxxxxx"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all text-left"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                <Wrench className="w-3 h-3 text-brand-teal" />
                نوع الخدمة المطلوبة
              </label>
              <div className="relative">
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all appearance-none"
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                >
                  <option value="ac_maintenance" className="bg-brand-card">صيانة مكيفات مركزية</option>
                  <option value="elevator_maintenance" className="bg-brand-card">فحص دوري للمصاعد</option>
                  <option value="ac_installation" className="bg-brand-card">تركيب وحدات جديدة</option>
                  <option value="technical_inspection" className="bg-brand-card">خدمات فنية عامة</option>
                </select>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <Wrench className="w-4 h-4 text-brand-teal" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                <Calendar className="w-3 h-3 text-brand-teal" />
                التاريخ المفضل للزيارة
              </label>
              <input
                required
                type="date"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all invert-0"
                style={{ colorScheme: 'dark' }}
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                <MapPin className="w-3 h-3 text-brand-teal" />
                عنوان الموقع (الحي، القطعة، الشارع)
              </label>
              <input
                required
                type="text"
                placeholder="أدخل عنوان الموقع بدقة لتسهيل وصول الفريق الفني"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-brand-teal" />
                وصف العطل أو الطلب
              </label>
              <textarea
                rows={4}
                placeholder="اخبرنا بالمزيد عن التحدي الفني الذي تواجهه..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-teal hover:bg-brand-teal-light text-black font-black py-6 rounded-2xl shadow-xl shadow-brand-teal/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الإرسال...' : 'تأكيد طلب الزيارة الفنية'}
              </button>
              <div className="flex items-center justify-center gap-2 mt-6 text-gray-600 text-xs font-bold uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                <span>سنقوم بالتواصل معك خلال اقل من 30 دقيقة</span>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
