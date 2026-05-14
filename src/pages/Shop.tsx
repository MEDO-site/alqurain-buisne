import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, SlidersHorizontal, ShoppingBag, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useCart } from '@/src/context/CartContext';
import { collection, getDocs, query, orderBy, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

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

const DEFAULT_PRODUCTS = [
  { id: '1', name: 'مكيف سبليت سوبر جنرال 18000 وحدة', price: 2450, cat: 'ac', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400', specs: 'كفاءة طاقة عالية، تبريد سريع، فلتر كربون', stock: 15, accessories: 'ريموت كنترول، طقم نحاس 5 متر' },
  { id: '2', name: 'وحدة التحكم في المصاعد الذكية', price: 1200, cat: 'elevators', image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=400', specs: 'نظام تشفير متطور، تحكم عبر التطبيق، حماية ضد انقطاع التيار', stock: 8, accessories: 'بطاقات تعريف، أسلاك توصيل فنية' },
  { id: '3', name: 'محرك مصعد 5 حصان إيطالي', price: 8500, cat: 'elevators', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400', specs: 'صناعة إيطالية، عمر افتراضي طويل، تشغيل هادئ', stock: 3, accessories: 'زيت تشحيم أصلي، قواعد تثبيت' },
  { id: '4', name: 'فلتر هواء مكيف مركزي عالي الكفاءة', price: 150, cat: 'ac', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400', specs: 'تنقية 99% من الغبار، قابل للغسل، أبعاد قياسية', stock: 50, accessories: 'بخاخ تنظيف' },
  { id: '5', name: 'مكيف كاسيت 36000 وحدة', price: 5600, cat: 'ac', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400', specs: 'توزيع هواء 360 درجة، مناسب للمساحات التجارية، موفر للطاقة', stock: 5, accessories: 'لوحة ديكور أصلية' },
  { id: '6', name: 'لوحة أزرار مصعد تاتش', price: 450, cat: 'elevators', image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=400', specs: 'مقاومة للبصمات، إضاءة LED زرقاء، استجابة سريعة', stock: 12, accessories: 'إطار ستانلس ستيل' },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), orderBy('cat'));
        const snap = await getDocs(q);
        
        if (snap.empty && isAdmin) {
           // Seed if empty and user is admin
           for (const p of DEFAULT_PRODUCTS) {
             const { id, ...rest } = p;
             await setDoc(doc(db, 'products', id), rest);
           }
           const reSnap = await getDocs(q);
           setProducts(reSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        } else {
           setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        }
      } catch (error) {
        console.error('Error fetching shop products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAdmin]);

  const filtered = products.filter(p => 
    (filter === 'all' || p.cat === filter) && 
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <header className="mb-16">
          <h2 className="text-xs font-black text-brand-teal tracking-[0.3em] uppercase mb-4">المتجر الفني</h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">حلول ذكية <span className="text-brand-teal italic">بين يديك</span></h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-8">
            <div className="bg-brand-card p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 blueprint-pattern opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>
              <h3 className="font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <SlidersHorizontal className="w-5 h-5 text-brand-teal" />
                تصفية النتائج
              </h3>
              
              <div className="relative mb-8 relative z-10">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="ابحث عن قطعة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pr-12 py-4 text-sm text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-3 relative z-10">
                <p className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4">التصنيفات</p>
                {[
                  { id: 'all', name: 'جميع المنتجات' },
                  { id: 'ac', name: 'أنظمة التكييف' },
                  { id: 'elevators', name: 'قطع المصاعد' },
                  { id: 'parts', name: 'ملحقات تقنية' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={cn(
                      "w-full text-right px-6 py-4 rounded-2xl text-sm font-bold transition-all border",
                      filter === cat.id 
                        ? "bg-brand-teal text-black border-brand-teal shadow-lg shadow-brand-teal/20" 
                        : "text-gray-400 border-transparent hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(n => (
                  <div key={n} className="h-[400px] bg-brand-card rounded-[40px] animate-pulse border border-white/5"></div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filtered.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-brand-card rounded-[40px] overflow-hidden border border-white/5 hover:border-brand-teal/30 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col"
                    >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="absolute bottom-6 left-6 bg-brand-teal text-black p-4 rounded-2xl shadow-xl hover:bg-brand-teal-light transition-all transform translate-y-20 group-hover:translate-y-0 duration-500"
                    >
                      <ShoppingBag className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-8 flex-1 flex flex-col gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-brand-teal tracking-[0.2em] mb-2">
                        {product.cat === 'ac' ? 'كفاءة طاقة' : 'جودة عالمية'}
                      </p>
                      <h4 className="text-xl font-bold text-white group-hover:text-brand-teal transition-colors tracking-tight line-clamp-2">{product.name}</h4>
                    </div>
                    
                    <div className="mt-auto flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">السعر النهائي</span>
                        <span className="text-2xl font-black text-white">{product.price} <span className="text-xs font-normal text-gray-500">ر.س</span></span>
                      </div>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="text-[10px] font-bold text-gray-400 hover:text-brand-teal uppercase tracking-widest border-b border-white/5 hover:border-brand-teal transition-all pb-1 translate-y-[-2px]"
                      >
                        التفاصيل الفنية
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
                </div>
                
                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-32 text-gray-600 bg-brand-card rounded-[40px] border border-white/5">
                    <ShoppingBag className="w-20 h-20 mb-6 opacity-10" />
                    <p className="text-lg font-medium">عذراً، لم نجد قطع مطابقة لبحثك في المتجر حالياً.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <motion.div 
        initial={false}
        animate={selectedProduct ? { opacity: 1, pointerEvents: 'auto' } : { opacity: 0, pointerEvents: 'none' }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
      >
        <div onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-brand-bg/90 backdrop-blur-md cursor-zoom-out" />
        {selectedProduct && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-5xl bg-brand-card rounded-[40px] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
          >
            <div className="w-full md:w-2/5 aspect-square md:aspect-auto bg-black/40 overflow-hidden border-b md:border-b-0 md:border-l border-white/5">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
               <div className="flex justify-between items-start mb-8">
                 <div>
                   <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-teal/20">
                     {selectedProduct.cat === 'ac' ? 'أنظمة تكييف' : selectedProduct.cat === 'elevators' ? 'قطع مصاعد' : 'ملحقات فنية'}
                   </span>
                   <h2 className="text-3xl font-bold text-white mt-4 tracking-tighter leading-tight">{selectedProduct.name}</h2>
                 </div>
                 <button onClick={() => setSelectedProduct(null)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-gray-500 hover:bg-red-400/10 hover:text-red-400 transition-all">
                   <X className="w-6 h-6" />
                 </button>
               </div>

               <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-white/5">
                 <div>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">السعر (ر.س)</p>
                   <p className="text-3xl font-black text-brand-teal">{selectedProduct.price}</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">حالة المخزون</p>
                   <p className={cn(
                     "text-sm font-bold flex items-center gap-2",
                     (selectedProduct.stock || 0) > 0 ? "text-green-400" : "text-red-400"
                   )}>
                     <span className={cn("w-2 h-2 rounded-full", (selectedProduct.stock || 0) > 0 ? "bg-green-400 animate-pulse" : "bg-red-400")} />
                     {(selectedProduct.stock || 0) > 0 ? `متوفر (${selectedProduct.stock} قطعة)` : 'نفذت الكمية'}
                   </p>
                 </div>
               </div>

               <div className="space-y-8 flex-1">
                 <div>
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">المواصفات الفنية</h4>
                   <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                     {selectedProduct.specs || 'لا تتوفر مواصفات فنية إضافية حالياً.'}
                   </p>
                 </div>

                 {selectedProduct.accessories && (
                   <div>
                     <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">ملحقات موصى بها</h4>
                     <p className="text-gray-300 leading-relaxed text-sm italic">
                       {selectedProduct.accessories}
                     </p>
                   </div>
                 )}
               </div>

               <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                 <button 
                   onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                   className="flex-1 bg-brand-teal text-black h-16 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-teal-light transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-teal/20"
                 >
                   <ShoppingCart className="w-5 h-5" />
                   إضافة إلى السلة
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
