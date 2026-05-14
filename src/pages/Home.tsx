import { motion } from 'motion/react';
import { ArrowRight, Wind, ArrowUp, ShieldCheck, Clock, Settings, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const categories = [
    {
      id: 'ac',
      title: 'أنظمة التكييف',
      desc: 'بيع وتوريد وصيانة جميع أنواع المكيفات المركزية والسبليت.',
      icon: <Wind className="w-8 h-8 text-black" />,
      image: '🌬️'
    },
    {
      id: 'elevators',
      title: 'المصاعد والسلالم',
      desc: 'تركيب وصيانة المصاعد بأحدث التقنيات ومعايير الأمان العالمية.',
      icon: <ArrowUp className="w-8 h-8 text-black" />,
      image: '🛗'
    },
    {
      id: 'technical',
      title: 'الخدمات الفنية',
      desc: 'حلول تقنية متكاملة وصيانة دورية للمنشآت والمشاريع.',
      icon: <Settings className="w-8 h-8 text-black" />,
      image: '🛠️'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
          {/* Left Content */}
          <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center gap-8 border-l border-white/5 bg-brand-bg relative z-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-4 px-4 py-2 bg-brand-teal/10 text-brand-teal text-xs font-black uppercase tracking-[0.2em] rounded-2xl border border-brand-teal/20 w-fit"
            >
              <div className="w-8 h-8 flex items-center justify-center p-1 bg-white/5 rounded-lg border border-white/10 shrink-0">
                <img 
                  src="https://artifact.m-a-i.io/api/v1/artifacts/370d0be0-e984-430e-90cb-48524b714e31/image_logo_qurain.png" 
                  alt="القرين" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-teal rounded-full animate-pulse"></span>
                خدمات فنية متكاملة 24/7
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-light leading-[1.1] text-white tracking-tighter"
            >
              نطور <span className="text-brand-teal font-medium italic">مساحاتكم</span><br/>بأعلى معايير الجودة
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg"
            >
              شركة القرين هي خياركم الأول للمصاعد الذكية، التكييف المركزي، والصيانة الفنية الشاملة بلمسة احترافية.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-4"
            >
              <Link
                to="/services"
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                طلب صيانة فورية
              </Link>
              <Link
                to="/shop"
                className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all"
              >
                تصفح المتجر
              </Link>
            </motion.div>
          </div>

          {/* Right Decorative Section */}
          <div className="hidden lg:block relative bg-[#111] overflow-hidden blueprint-pattern">
            <div className="absolute inset-0 bg-gradient-to-l from-brand-bg to-transparent"></div>
            <div className="relative h-full flex items-center justify-center p-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1 }}
                className="w-full max-w-md aspect-[3/4] bg-gradient-to-br from-brand-teal/20 to-transparent border border-brand-teal/30 rounded-[40px] flex flex-col p-10 backdrop-blur-2xl shadow-2xl relative"
              >
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-teal/10 blur-[100px] rounded-full"></div>
                <div className="w-full aspect-square bg-black/40 rounded-3xl mb-8 flex items-center justify-center border border-white/5 text-brand-teal text-7xl shadow-inner">
                   ⚙️
                </div>
                <div className="space-y-6">
                  <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
                  <div className="h-4 w-1/2 bg-white/5 rounded-full"></div>
                  <div className="h-16 w-full bg-brand-teal/20 border border-brand-teal/40 rounded-2xl mt-8 flex items-center justify-center text-brand-teal font-black uppercase tracking-[0.2em] text-sm group cursor-pointer hover:bg-brand-teal/30 transition-all">
                    تحقق من الأنظمة
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Grid */}
      <section className="py-24 bg-brand-bg px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-sm font-black text-brand-teal tracking-[0.3em] uppercase mb-4">أبرز خدماتنا</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">حلول متكاملة للمنشآت</h3>
            </div>
            <Link to="/shop" className="text-brand-teal text-sm font-bold hover:underline">شاهد المتجر الكامل &larr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-brand-card p-8 rounded-[32px] border border-white/5 hover:border-brand-teal/30 transition-all duration-500 flex flex-col gap-6"
              >
                <div className="h-40 bg-black/40 rounded-2xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-inner">
                  {cat.image}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-brand-teal transition-colors">{cat.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{cat.desc}</p>
                </div>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-brand-teal font-black text-xs uppercase tracking-[0.2em]">عرض التفاصيل</span>
                  <div className="bg-white/5 p-3 rounded-full group-hover:bg-brand-teal group-hover:text-black transition-all">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-32 bg-[#0c0c0c]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-16 rounded-[60px] bg-gradient-to-br from-brand-teal/10 to-transparent border border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 blueprint-pattern opacity-20 pointer-events-none"></div>
            <h3 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter relative z-10">هل تحتاج لخدمة صيانة <span className="text-brand-teal italic">فورية</span>؟</h3>
            <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto relative z-10">فريقنا الهندسي متاح دائماً للتعامل مع كافة التحديات الفنية بأحدث التقنيات.</p>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Link to="/contact" className="px-10 py-5 bg-brand-teal text-black font-black rounded-2xl hover:bg-brand-teal-light transition-all shadow-xl shadow-brand-teal/20">تواصل معنا الآن</Link>
              <Link to="/services" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">احجز موعداً</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
