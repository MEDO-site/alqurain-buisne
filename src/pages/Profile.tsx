import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Mail, Save, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [user, profile, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="pt-32 pb-20 bg-brand-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-black text-brand-teal tracking-[0.3em] uppercase mb-4">الملف الشخصي</h2>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">إدارة <span className="text-brand-teal italic">بياناتك</span></h1>
          </div>
          <Link to="/dashboard" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            <ArrowRight className="w-4 h-4 rotate-180" />
            العودة للوحة التحكم
          </Link>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-card rounded-[50px] border border-white/5 overflow-hidden shadow-2xl relative group"
        >
          <div className="absolute inset-0 blueprint-pattern opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>
          
          <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <User className="w-3 h-3 text-brand-teal" />
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-brand-teal transition-all"
                  placeholder="الاسم"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <Phone className="w-3 h-3 text-brand-teal" />
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-brand-teal transition-all"
                  placeholder="05xxxxxxx"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <Mail className="w-3 h-3 text-brand-teal" />
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-brand-teal" />
                  العنوان المعتمد
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-brand-teal transition-all"
                  placeholder="أدخل عنوانك بالتفصيل (الحي، الشارع، المبنى)"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-brand-teal text-black font-black py-6 rounded-2xl shadow-xl shadow-brand-teal/20 hover:bg-brand-teal-light transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                {saving ? 'جاري الحفظ...' : (
                  <>
                    <Save className="w-5 h-5" />
                    حفظ التغييرات
                  </>
                )}
              </button>
              
              {success && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-green-400 text-sm font-bold mt-4"
                >
                  تم تحديث بياناتك بنجاح!
                </motion.p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
