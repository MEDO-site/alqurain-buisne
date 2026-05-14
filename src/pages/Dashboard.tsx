import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  Package, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User as UserIcon,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: any;
  items: any[];
}

interface Maintenance {
  id: string;
  service: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  date: string;
  createdAt: any;
}

export default function Dashboard() {
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      if (!user) return;
      try {
        if (isAdmin) {
          // Fetch All Orders (Worker View)
          const allOrdersQuery = query(
            collection(db, 'orders'),
            orderBy('createdAt', 'desc')
          );
          const ordersSnap = await getDocs(allOrdersQuery);
          setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

          // Fetch All Maintenance Requests (Worker View)
          const allMaintenanceQuery = query(
            collection(db, 'maintenance'),
            orderBy('createdAt', 'desc')
          );
          const maintenanceSnap = await getDocs(allMaintenanceQuery);
          setRequests(maintenanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Maintenance)));
        } else {
          // Customer View: Empty state as per user request "والزبائن لا"
          setOrders([]);
          setRequests([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, authLoading, isAdmin, navigate]);

  if (authLoading || loading) {
    return (
      <div className="pt-48 pb-20 text-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-brand-teal/20 rounded-full mb-4"></div>
          <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">جاري تحميل بيانات النظام...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'processing':
      case 'accepted': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: 'قيد المراجعة',
      processing: 'جاري التنفيذ',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      accepted: 'تم قبول الطلب',
      completed: 'مكتمل',
      cancelled: 'تم الإلغاء'
    };
    return map[status] || status;
  };

  return (
    <div className="pt-32 pb-20 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-xs font-black text-brand-teal tracking-[0.3em] uppercase mb-4">نظام إدارة العمليات {isAdmin ? '(للموظفين)' : '(للعملاء)'}</h2>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
              أهلاً بك، <span className="text-brand-teal italic">{profile?.name || user?.displayName}</span>
            </h1>
          </div>
          {isAdmin && (
             <div className="px-4 py-2 bg-brand-teal text-black text-[10px] font-black uppercase rounded-lg">وضع الموظف الفني</div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {!isAdmin ? (
               <div className="p-16 rounded-[40px] bg-brand-card border border-white/5 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-800 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">صلاحيات الموظفين فقط</h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">عذراً، تتبع الطلبات التفصيلي متاح حالياً لفريق العمل فقط لضمان سرعة التنفيذ.</p>
                  <Link to="/contact" className="text-brand-teal font-black uppercase tracking-widest text-xs hover:underline">تواصل مع الدعم الفني للاستفسار &larr;</Link>
               </div>
            ) : (
              <>
                {/* Maintenance Requests Section */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-brand-teal" />
                      كافة طلبات الصيانة الواردة
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {requests.length === 0 ? (
                      <div className="p-12 rounded-[40px] bg-brand-card border border-white/5 text-center">
                        <p className="text-gray-500 text-sm">لا توجد طلبات صيانة حالية في النظام.</p>
                      </div>
                    ) : (
                      requests.map((req) => (
                        <motion.div 
                          key={req.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-6 rounded-[32px] bg-brand-card border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-brand-teal/30 transition-all"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center text-brand-teal border border-white/5">
                              <Wrench className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-white font-bold tracking-tight">{req.service === 'ac_maintenance' ? 'صيانة مكيفات' : 'صيانة مصاعد'}</h4>
                                <span className="text-[10px] text-gray-500 font-bold">#{req.id.slice(-6)}</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {req.date}</span>
                                <span className="flex items-center gap-1.5 font-bold text-brand-teal">بواسطة: {req.name || 'عميل'}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] w-fit ${getStatusColor(req.status)} text-center`}>
                            {getStatusText(req.status)}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </section>

                {/* Orders Section */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Package className="w-5 h-5 text-brand-teal" />
                      كافة طلبات الشراء
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="p-12 rounded-[40px] bg-brand-card border border-white/5 text-center">
                        <p className="text-gray-500 text-sm">لا توجد طلبات شراء حالية في النظام.</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <motion.div 
                          key={order.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-6 rounded-[32px] bg-brand-card border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-teal/30 transition-all"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center text-brand-teal border border-white/5">
                              <Package className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-white font-bold tracking-tight mb-1">طلب #{order.id.slice(-8)}</h4>
                              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                <span className="text-brand-teal font-black">{order.total} ر.س</span>
                                <span>{order.items.length} منتجات</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] w-fit ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sidebar: Profile Summary & Stats */}
          <div className="space-y-8">
            {isAdmin && (
              <div className="bg-brand-teal/10 border border-brand-teal/30 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-24 h-24 bg-brand-teal/10 blur-3xl rounded-full"></div>
                <h3 className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  أدوات المسؤول
                </h3>
                <div className="space-y-3">
                  <Link 
                    to="/admin/products" 
                    className="flex items-center justify-between p-4 bg-brand-teal text-black rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-brand-teal/20"
                  >
                    إدارة المنتجات والأسعار
                    <ChevronRight className="w-4 h-4 -rotate-180" />
                  </Link>
                  <p className="text-[10px] text-gray-500 font-medium px-2 leading-relaxed">
                    يمكنك تعديل أسعار قطع الغيار، إضافة منتجات جديدة، أو تحديث الصور الفنية للمتجر.
                  </p>
                </div>
              </div>
            )}

            <div className="p-8 rounded-[40px] bg-brand-card border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 blueprint-pattern opacity-10 pointer-events-none"></div>
              <h4 className="text-xs font-black text-white tracking-[0.3em] uppercase mb-8 relative z-10">معلومات الاتصال</h4>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4 text-brand-teal" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest mb-1">الاسم</p>
                    <p className="text-white font-bold">{profile?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-brand-teal" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest mb-1">عضو منذ</p>
                    <p className="text-white font-bold text-sm">2024</p>
                  </div>
                </div>

                <Link to="/profile" className="block w-full text-center py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-widest">
                  إدارة الحساب
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4">
              <Link to="/services" className="p-6 rounded-3xl bg-brand-teal text-black flex items-center justify-between group hover:bg-brand-teal-light transition-all shadow-xl shadow-brand-teal/10">
                <span className="font-black uppercase tracking-widest text-xs">حجز موعد صيانة</span>
                <ChevronRight className="w-5 h-5 -rotate-180 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="p-6 rounded-3xl bg-white/5 border border-white/10 text-white flex items-center justify-between group hover:bg-white/10 transition-all">
                <span className="font-black uppercase tracking-widest text-xs">الدعم الفني المباشر</span>
                <ChevronRight className="w-5 h-5 -rotate-180 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
