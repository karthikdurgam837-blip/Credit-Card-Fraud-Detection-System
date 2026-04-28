import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  CreditCard, 
  MapPin, 
  BarChart2,
  Calendar, 
  AlertTriangle,
  Percent,
  Terminal,
  Zap,
  ChevronRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { format, subDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from '@/src/components/Skeleton';
import { cn } from '@/src/lib/utils';

const GlobalThreatMap = () => (
  <div className="w-full h-[320px] bg-stone-50/50 rounded-[32px] relative flex items-center justify-center overflow-hidden border border-stone-100 group/map shadow-inner">
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    
    <svg viewBox="0 0 1000 500" className="w-full h-full opacity-40 transition-transform duration-1000 group-hover/map:scale-[1.02]">
      {/* Simplified World Map Paths - Softened */}
      <motion.path 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-stone-300"
        d="M150,150 Q250,50 400,100 T600,150 T800,100" // Decorative land line
      />
      {/* Abstract Dots for landmasses */}
      {[...Array(50)].map((_, i) => (
        <circle 
          key={i} 
          cx={100 + Math.random() * 800} 
          cy={50 + Math.random() * 400} 
          r="0.5" 
          className="text-stone-200 fill-current" 
        />
      ))}
    </svg>

    {/* Dynamic Hotspots - Warmer Amber/Clay */}
    <div className="absolute inset-0 pointer-events-none">
       {/* North America */}
       <div className="absolute top-[35%] left-[22%]">
          <div className="relative group/ping">
             <div className="w-4 h-4 bg-terracotta rounded-full animate-ping opacity-25"></div>
             <div className="absolute inset-0 w-4 h-4 bg-terracotta rounded-full shadow-[0_0_15px_rgba(203,153,126,0.3)]"></div>
             <div className="absolute top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-stone-900 text-white text-[8px] font-black uppercase rounded-lg opacity-0 group-hover/ping:opacity-100 transition-opacity whitespace-nowrap">East Node</div>
          </div>
       </div>

       {/* Europe */}
       <div className="absolute top-[30%] left-[48%]">
          <div className="relative group/ping">
             <div className="w-3 h-3 bg-warm-clay rounded-full animate-ping opacity-25" style={{ animationDelay: '0.5s' }}></div>
             <div className="absolute inset-0 w-3 h-3 bg-warm-clay rounded-full shadow-[0_0_10px_rgba(124,78,46,0.3)]"></div>
          </div>
       </div>

       {/* Asia */}
       <div className="absolute top-[42%] left-[75%]">
          <div className="relative group/ping">
             <div className="w-4 h-4 bg-soft-sage rounded-full animate-ping opacity-25" style={{ animationDelay: '1.2s' }}></div>
             <div className="absolute inset-0 w-4 h-4 bg-soft-sage rounded-full shadow-[0_0_15px_rgba(107,112,92,0.3)]"></div>
          </div>
       </div>
    </div>

    <div className="absolute bottom-6 left-8 flex items-center gap-6">
       <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-terracotta rounded-full"></div>
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Active Care</span>
       </div>
       <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-soft-sage rounded-full"></div>
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Secured</span>
       </div>
    </div>

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] transition-opacity group-hover/map:opacity-[0.05]">
       <MapPin className="w-40 h-40 text-stone-900" />
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, color = "bg-soft-sage" }: any) => (
  <div className="flex flex-col gap-1 mb-6">
    <div className="flex items-center gap-3">
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-transform hover:scale-110", color)}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-lg font-black text-stone-900 tracking-tight font-serif italic">{title}</h3>
    </div>
    {subtitle && <p className="text-[11px] text-stone-400 font-bold ml-11 uppercase tracking-widest leading-none opacity-60">{subtitle}</p>}
  </div>
);

const MetricCard = ({ icon: Icon, title, value, label, loading, color = "text-stone-900" }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-stone-100 flex items-center gap-6 group hover:organic-shadow transition-all duration-500 cursor-pointer metric-card">
    <div className={cn("w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center transition-all group-hover:rotate-6", color)}>
      <Icon className="w-7 h-7" />
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      {loading ? (
        <Skeleton className="h-8 w-24 mt-1" />
      ) : (
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-black text-stone-900 tracking-tighter">{value}</h4>
          {label && <span className="text-sm font-black text-stone-300">{label}</span>}
        </div>
      )}
    </div>
  </div>
);

const EventLog = ({ transactions }: { transactions: any[] }) => {
  const recent = transactions.filter(t => t.prob > 0.4).slice(0, 5);
  return (
    <div className="mt-8 bg-stone-900 rounded-[32px] p-10 text-white relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-terracotta rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Terminal className="w-5 h-5 text-terracotta" />
             </div>
             <div>
                <h3 className="text-xl font-bold font-serif italic text-white/90">Collective Stream</h3>
                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest leading-none mt-1">Real-time Observations</p>
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {recent.map((tx, i) => (
              <motion.div 
                key={tx.tx_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    tx.prob > 0.7 ? "bg-terracotta/20 text-terracotta" : "bg-soft-sage/20 text-soft-sage"
                  )}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black font-mono tracking-tight text-white/90">{tx.tx_id}</p>
                    <p className="text-[9px] text-white/30 uppercase font-black">{tx.merchant} • {tx.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-xs font-black",
                    tx.prob > 0.7 ? "text-terracotta" : "text-soft-sage"
                  )}>{(tx.prob * 100).toFixed(0)}% Concern</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard({ transactions, loading }: { transactions: any[], loading?: boolean }) {
  const stats = useMemo(() => {
    const fraud = transactions.filter(t => t.prob > 0.7);
    const fraudRate = (fraud.length / (transactions.length || 1)) * 0.04;
    const totalAmount = fraud.reduce((acc, curr) => acc + curr.amount, 0) / 1000;

    return {
      count: fraud.length,
      rate: (fraudRate * 100).toFixed(2),
      total: totalAmount.toFixed(1)
    };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats = transactions.reduce((acc: any, t) => {
      if (t.prob > 0.7) {
        acc[t.category] = (acc[t.category] || 0) + 1;
      }
      return acc;
    }, {});
    
    return Object.entries(cats)
      .map(([name, value]) => ({ name: name.replace('category_', ''), value }))
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  const riskData = useMemo(() => {
    const groups = {
      'Low Confidence': { low: 10, high: 2 },
      'Medium Confidence': { low: 5, high: 8 },
      'High Confidence': { low: 2, high: 15 }
    };
    return Object.entries(groups).map(([name, data]) => ({ name, ...data }));
  }, []);

  const timeData = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      name: format(subDays(new Date(), 13 - i), 'MMM d'),
      value: Math.random() * 5 + 2
    }));
  }, []);

  const topMerchants = useMemo(() => {
    const merchants = transactions
      .filter(t => t.prob > 0.7)
      .reduce((acc: any, t) => {
        if (!acc[t.merchant]) acc[t.merchant] = { name: t.merchant, amount: 0, count: 0, category: t.category };
        acc[t.merchant].amount += t.amount;
        acc[t.merchant].count += 1;
        return acc;
      }, {});
    return Object.values(merchants)
      .sort((a: any, b: any) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
        <div>
           <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-stone-100 rounded-lg mb-4">
              <Zap className="w-3 h-3 text-terracotta" />
              <span className="text-[9px] font-black tracking-[0.2em] uppercase text-stone-500">Live Collective</span>
           </div>
           <h1 className="text-4xl font-black tracking-tight text-stone-900 font-serif italic">
             Safety Curator
           </h1>
           <p className="text-stone-500 font-medium mt-2 max-w-sm italic font-serif leading-relaxed">
             Our shared engine has highlighted {stats.count} observations for your review.
           </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-white px-6 py-4 rounded-[28px] border border-stone-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-soft-sage/10 rounded-full flex items-center justify-center">
                 <ShieldCheck className="w-5 h-5 text-soft-sage" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">Trust Level</p>
                 <p className="text-xl font-black text-stone-900 mt-1">{stats.rate}%</p>
              </div>
           </div>
           <button className="h-14 px-6 bg-stone-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10">
              Refresh Node
           </button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          icon={AlertTriangle} 
          title="Points of Review" 
          value={stats.count} 
          loading={loading}
          color="bg-terracotta/10 text-terracotta"
        />
        <MetricCard 
          icon={Zap} 
          title="Review Precision" 
          value="99.4" 
          label="%"
          loading={loading}
          color="bg-soft-sage/10 text-soft-sage"
        />
        <MetricCard 
          icon={TrendingUp} 
          title="Safe Volume" 
          value={stats.total} 
          label="K"
          loading={loading}
          color="bg-warm-clay/10 text-warm-clay"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <motion.div variants={item} className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm relative overflow-hidden group">
              <SectionHeader icon={MapPin} title="Safety Presence" subtitle="Where we're focused right now" color="bg-terracotta" />
              {loading ? <Skeleton className="h-[320px] w-full rounded-[32px]" /> : <GlobalThreatMap />}
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={item} className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm">
                <SectionHeader icon={BarChart2} title="Review Spheres" subtitle="Categories of interest" />
                <div className="h-[240px] w-full">
                  {loading ? (
                    <div className="space-y-4 pt-4">
                      {[1, 2, 3, 4].map(i => <div key={i}><Skeleton className="h-7 w-full rounded-lg" /></div>)}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData} layout="vertical" margin={{ left: -30 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={10} width={80} tick={{ fontWeight: 800, fill: '#78716c' }} />
                        <Tooltip 
                           contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px' }}
                           cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        />
                        <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={20}>
                           {categoryData.map((_, i) => (
                             <Cell key={`cell-${i}`} fill={i % 2 === 0 ? "#7c4e2e" : "#cb997e"} className="hover:opacity-80 transition-opacity" />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>

              <motion.div variants={item} className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm">
                <SectionHeader icon={AlertTriangle} title="Observation Spread" subtitle="Probability Model" color="bg-terracotta" />
                <div className="h-[240px] w-full">
                  {loading ? <Skeleton className="h-full w-full rounded-3xl" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={riskData} margin={{ top: 10, bottom: -10 }}>
                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fontWeight: 700, fill: '#78716c' }} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} hide />
                        <Bar dataKey="low" stackId="a" fill="#433e37" barSize={24} radius={[0, 0, 0, 0]} />
                        <Bar dataKey="high" stackId="a" fill="#cb997e" barSize={24} radius={[12, 12, 0, 0]} />
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <motion.div variants={item} className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-terracotta/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
             <SectionHeader icon={CreditCard} title="Action Hub" subtitle="Active Observation Nodes" />
             {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => <div key={i}><Skeleton className="h-10 w-full rounded-2xl" /></div>)}
                </div>
             ) : (
                <div className="space-y-3">
                   {topMerchants.map((m, i) => (
                      <div key={i} className="p-5 rounded-[32px] bg-stone-50 border border-stone-100 flex items-center justify-between hover:bg-white hover:organic-shadow hover:-translate-y-1 transition-all group/item">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-300 group-hover/item:text-terracotta transition-colors shadow-sm">
                               <Zap className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-stone-900 leading-tight">{m.name}</p>
                               <p className="text-[10px] font-black text-stone-400 uppercase tracking-tight mt-0.5">{m.category}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-stone-900">${m.amount.toFixed(0)}</p>
                            <p className="text-[10px] font-bold text-terracotta uppercase">{m.count} Reviews</p>
                         </div>
                      </div>
                   ))}
                </div>
             )}
             <button className="w-full mt-8 p-5 rounded-[28px] bg-stone-900 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-stone-800 transition-all group/btn shadow-xl shadow-stone-900/10">
                Collective View
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
             </button>
          </motion.div>

          <EventLog transactions={transactions} />
        </div>
      </div>
    </motion.div>
  );
}
