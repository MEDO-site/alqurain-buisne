import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, User, Phone, Menu, X, Hammer, Wind, ArrowUp, Info, History, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { items } = useCart();
  const { user, login, logout, profile, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المتجر', path: '/shop' },
    { name: 'الخدمات الفنية', path: '/services' },
    { name: 'من نحن', path: '/about' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-gray-200 flex flex-col" dir="rtl">
      {/* Navigation */}
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300 border-b',
          scrolled ? 'bg-brand-nav/95 backdrop-blur-md py-3 border-white/5 shadow-2xl' : 'bg-transparent py-6 border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-1 bg-white/5 rounded-xl border border-white/10 group-hover:border-brand-teal/50 transition-all">
                <img 
                  src="https://artifact.m-a-i.io/api/v1/artifacts/370d0be0-e984-430e-90cb-48524b714e31/image_logo_qurain.png" 
                  alt="شركة القرين" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tighter text-white leading-none group-hover:text-brand-teal transition-colors">شركة القرين</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mt-1">تكييف • مصاعد • حلول</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-all duration-300",
                    location.pathname === link.path 
                      ? "text-brand-teal" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6">
              <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-teal text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {items.length}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all group"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-teal flex items-center justify-center text-black font-black text-[10px]">
                      {profile?.name?.charAt(0) || user.email?.charAt(0)}
                    </div>
                    <div className="flex flex-col items-start">
                       <span className="text-sm font-bold text-gray-200 hidden lg:block">{profile?.name || 'العميل'}</span>
                       {isAdmin && <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest leading-none">موظف</span>}
                    </div>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute left-0 mt-4 w-48 bg-brand-card border border-white/10 rounded-2xl shadow-2xl py-2 z-[60] overflow-hidden">
                      <Link 
                        to="/dashboard" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <History className="w-4 h-4" />
                        {isAdmin ? 'لوحة الموظفين' : 'حالة الطلبات'}
                      </Link>
                      {isAdmin && (
                        <Link 
                          to="/admin/products" 
                          className="flex items-center gap-3 px-4 py-3 text-sm text-brand-teal hover:bg-white/5 transition-all"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          إدارة المتجر
                        </Link>
                      )}
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        الملف الشخصي
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-all border-t border-white/5 mt-2"
                      >
                        <X className="w-4 h-4" />
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="hidden md:block bg-brand-teal hover:bg-brand-teal-light text-black px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-brand-teal/20"
                >
                  تسجيل الدخول
                </button>
              )}

              <button
                className="md:hidden p-2 text-gray-400"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-nav border-b border-white/5 overflow-hidden shadow-2xl"
            >
              <div className="px-6 pt-4 pb-8 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "block px-4 py-4 text-base font-medium transition-colors rounded-xl",
                      location.pathname === link.path ? "bg-white/5 text-brand-teal" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-bg border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 border border-white/10">
                  <img 
                    src="https://artifact.m-a-i.io/api/v1/artifacts/370d0be0-e984-430e-90cb-48524b714e31/image_logo_qurain.png" 
                    alt="شركة القرين" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-white tracking-tighter">شركة القرين</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                شركة القرين هي خياركم الأول للحلول الفنية المتكاملة في المصاعد الذكية والتكييف المركزي والصيانة الشاملة.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-200 mb-8">روابط الشركة</h3>
              <ul className="space-y-4">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-500 hover:text-brand-teal transition-colors text-sm">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-200 mb-8">خدماتنا</h3>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-brand-teal transition-colors cursor-pointer text-gray-500">أنظمة التكييف المركزي</li>
                <li className="hover:text-brand-teal transition-colors cursor-pointer text-gray-500">تركيب وصيانة المصاعد</li>
                <li className="hover:text-brand-teal transition-colors cursor-pointer text-gray-500">عقود الصيانة الدورية</li>
                <li className="hover:text-brand-teal transition-colors cursor-pointer text-gray-500">توريد فني خاص</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-200 mb-8">التواصل</h3>
              <div className="space-y-4 text-sm text-gray-500">
                <div className="flex items-center gap-3 group">
                  <Phone className="w-4 h-4 text-brand-teal group-hover:scale-110 transition-transform" />
                  <span dir="ltr">+966 500 000 000</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                  <span>الكويت، الشويخ الصناعية،<br/>شارع بيبسي، مجمع الفني</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
            <div className="flex gap-8">
              <span>المبيعات: 1800000</span>
              <span>الدعم: 1800001</span>
            </div>
            <div className="text-center md:text-right">
              جميع الحقوق محفوظة لشركة القرين الفنية © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
