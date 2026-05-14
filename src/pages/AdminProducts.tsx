import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Plus, Save, Trash2, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  cat: string;
  image: string;
  specs?: string;
  stock?: number;
  accessories?: string;
}

const CATEGORIES = [
  { id: 'ac', name: 'أنظمة التكييف' },
  { id: 'elevators', name: 'قطع المصاعد' },
  { id: 'parts', name: 'ملحقات تقنية' }
];

export default function AdminProducts() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    cat: 'ac',
    image: '',
    specs: '',
    stock: 0,
    accessories: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('cat'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      cat: product.cat,
      image: product.image,
      specs: product.specs || '',
      stock: product.stock || 0,
      accessories: product.accessories || ''
    });
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      showFeedback('success', 'تم حذف المنتج بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingId || doc(collection(db, 'products')).id;
      await setDoc(doc(db, 'products', id), form);
      
      showFeedback('success', editingId ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
      setEditingId(null);
      setIsAdding(false);
      setForm({ name: '', price: 0, cat: 'ac', image: '', specs: '', stock: 0, accessories: '' });
      fetchProducts();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  if (authLoading || loading) {
    return (
      <div className="pt-40 pb-20 flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="animate-spin w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-xs font-black text-brand-teal tracking-[0.3em] uppercase mb-4">إدارة المتجر الفني</h2>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">التحكم في <span className="text-brand-teal italic">المنتجات والأسعار</span></h1>
          </div>
          <button 
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setForm({ name: '', price: 0, cat: 'ac', image: '', specs: '', stock: 0, accessories: '' });
            }}
            className="flex items-center gap-2 bg-brand-teal text-black px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-teal-light transition-all shadow-xl shadow-brand-teal/20"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج جديد
          </button>
        </header>

        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-8 p-4 rounded-2xl flex items-center gap-3 border",
              feedback.type === 'success' ? "bg-brand-teal/10 border-brand-teal/30 text-brand-teal" : "bg-red-400/10 border-red-400/30 text-red-400"
            )}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-bold text-sm">{feedback.message}</span>
          </motion.div>
        )}

        {/* Modal Overlay */}
        {(isAdding || editingId) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="absolute inset-0 bg-brand-bg/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-4xl bg-brand-card rounded-[40px] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div>
                  <h3 className="text-2xl font-bold text-white">{editingId ? 'تعديل تفاصيل المنتج' : 'إضافة منتج جديد للمتجر'}</h3>
                  <p className="text-gray-500 text-sm mt-1">أدخل البيانات الفنية والأسعار بدقة لضمان أفضل تجربة للعميل.</p>
                </div>
                <button 
                  onClick={() => { setIsAdding(false); setEditingId(null); }} 
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-gray-400 hover:bg-red-400/10 hover:text-red-400 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-brand-teal font-black text-[10px] uppercase tracking-[0.3em] mb-4">المعلومات الأساسية</h4>
                      
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">اسم المنتج الفني</label>
                        <input 
                          type="text" 
                          required
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                          placeholder="مثلاً: كمبروسر تكييف 2 طن"
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">السعر (ر.س)</label>
                          <input 
                            type="number" 
                            required
                            value={form.price}
                            onChange={e => setForm({...form, price: Number(e.target.value)})}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">الكمية المتوفرة</label>
                          <input 
                            type="number" 
                            required
                            value={form.stock}
                            onChange={e => setForm({...form, stock: Number(e.target.value)})}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">التصنيف</label>
                        <select 
                          value={form.cat}
                          onChange={e => setForm({...form, cat: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent appearance-none transition-all cursor-pointer"
                        >
                          {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-brand-card">{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-brand-teal font-black text-[10px] uppercase tracking-[0.3em] mb-4">الوسائط والصورة</h4>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">رابط صورة المنتج</label>
                        <div className="relative">
                          <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            type="url" 
                            required
                            value={form.image}
                            onChange={e => setForm({...form, image: e.target.value})}
                            placeholder="https://..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pr-12 py-4 text-white text-xs focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="aspect-video bg-black/60 rounded-[32px] border border-white/5 overflow-hidden flex items-center justify-center relative group">
                        {form.image ? (
                          <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-800 mx-auto mb-2" />
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">معاينة الصورة</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tech Details */}
                  <div className="space-y-8 pt-8 border-t border-white/5">
                    <h4 className="text-brand-teal font-black text-[10px] uppercase tracking-[0.3em]">المواصفات الفنية المتقدمة</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">المواصفات التقنية (Specs)</label>
                        <textarea 
                          rows={6}
                          value={form.specs}
                          onChange={e => setForm({...form, specs: e.target.value})}
                          placeholder="أدخل المواصفات التقنية هنا (مثلاً: الفولت، الضغط، الأبعاد...)"
                          className="w-full bg-black/40 border border-white/10 rounded-[32px] px-6 py-6 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all resize-none text-sm leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">الملحقات وقطع الغيار المرتبطة</label>
                        <textarea 
                          rows={6}
                          value={form.accessories}
                          onChange={e => setForm({...form, accessories: e.target.value})}
                          placeholder="أدخل الملحقات الموصى بها لهذا المنتج..."
                          className="w-full bg-black/40 border border-white/10 rounded-[32px] px-6 py-6 text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all resize-none text-sm leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 pb-2">
                    <button 
                      type="submit"
                      className="w-full bg-brand-teal text-black font-black py-6 rounded-2xl hover:bg-brand-teal-light transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-teal/20 transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Save className="w-5 h-5" />
                      <span className="uppercase tracking-widest text-sm">{editingId ? 'تحديث بيانات المنتج' : 'إدراج المنتج في المتجر'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-10">
          {/* Product Grid - Full Width now that form is a modal */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <motion.div 
                  key={product.id}
                  className="bg-brand-card p-8 rounded-[40px] border border-white/5 flex flex-col group hover:border-brand-teal/30 transition-all shadow-xl"
                >
                  <div className="w-full aspect-[4/3] bg-black/40 rounded-[32px] overflow-hidden border border-white/5 mb-6 relative group-hover:shadow-2xl transition-all">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4">
                       <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-brand-teal uppercase tracking-widest border border-white/10">
                        {CATEGORIES.find(c => c.id === product.cat)?.name}
                       </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h4 className="text-white text-xl font-bold tracking-tight line-clamp-2">{product.name}</h4>
                      <p className="text-brand-teal font-black text-lg shrink-0">{product.price} <span className="text-[10px] uppercase font-bold text-gray-500">ر.س</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-white/5">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="flex items-center justify-center gap-2 bg-white/5 text-white p-4 rounded-2xl hover:bg-brand-teal hover:text-black transition-all font-bold text-xs"
                      >
                         تعديل التفاصيل
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center justify-center gap-2 bg-white/5 text-gray-500 p-4 rounded-2xl hover:bg-red-400/20 hover:text-red-400 transition-all font-bold text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {products.length === 0 && !loading && (
              <div className="p-20 text-center bg-brand-card border border-white/5 rounded-[40px]">
                <Package className="w-16 h-16 text-gray-800 mx-auto mb-6" />
                <p className="text-gray-500">لا يوجد منتجات في المتجر حالياً.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
