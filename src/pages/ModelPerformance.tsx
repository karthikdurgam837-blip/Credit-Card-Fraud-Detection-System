import React from 'react';
import { 
  Target, 
  BarChart3, 
  Activity, 
  Shield, 
  BrainCircuit,
  Zap,
  Info,
  ChevronRight,
  Cpu,
  Layers,
  Dna
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';

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

export default function ModelPerformance() {
  const prCurve = [
    { recall: 0.0, precision: 1.0 },
    { recall: 0.2, precision: 0.98 },
    { recall: 0.4, precision: 0.96 },
    { recall: 0.6, precision: 0.92 },
    { recall: 0.8, precision: 0.85 },
    { recall: 0.9, precision: 0.70 },
    { recall: 1.0, precision: 0.40 },
  ];

  const featureImpact = [
    { name: 'amount', value: 85 },
    { name: 'velocity_1h', value: 72 },
    { name: 'is_intl', value: 64 },
    { name: 'hour', value: 45 },
    { name: 'device_match', value: 38 },
    { name: 'merchant_cat', value: 31 },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
        <div>
           <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-stone-100 rounded-lg mb-4">
              <Cpu className="w-3 h-3 text-terracotta" />
              <span className="text-[9px] font-black tracking-[0.2em] uppercase text-stone-500">Awareness v2.4</span>
           </div>
           <h1 className="text-4xl font-black tracking-tight text-stone-900 font-serif italic">
             Shared Understanding
           </h1>
           <p className="text-stone-500 font-medium mt-2 max-w-sm italic font-serif leading-relaxed">
             Our collective intelligence processes moments with 94.2% precision.
           </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Diagnostic Stats */}
        <motion.div variants={item} className="lg:col-span-2 bg-stone-900 rounded-[48px] p-10 text-white relative overflow-hidden flex flex-col justify-center min-h-[300px] shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(215,100,69,0.15),transparent)]"></div>
          
          <div className="grid grid-cols-3 gap-8 relative z-10">
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">Response Tempo</p>
              <div className="flex items-baseline gap-1">
                 <p className="text-3xl font-black text-stone-100">142</p>
                 <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">ms</span>
              </div>
            </div>
             <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">Active Thoughts</p>
              <div className="flex items-baseline gap-1">
                 <p className="text-3xl font-black text-stone-100">2.4</p>
                 <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">k/m</span>
              </div>
            </div>
             <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">Trust Growth</p>
              <div className="flex items-baseline gap-1">
                 <p className="text-3xl font-black text-soft-sage">+1.2</p>
                 <span className="text-[10px] font-black text-soft-sage/40 uppercase tracking-widest">%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Confidence Gauge */}
        <motion.div variants={item} className="bg-white rounded-[48px] border border-stone-100 p-10 flex flex-col justify-between shadow-xl shadow-stone-900/5 relative group overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
               <h3 className="text-2xl font-black font-serif italic text-stone-900 leading-none">Shared Trust</h3>
               <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest mt-2">Collective Understanding</p>
            </div>
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
               <Shield className="w-6 h-6" />
            </div>
          </div>
          
          <div className="py-12 flex items-center justify-center relative scale-110">
            <div className="w-56 h-56 rounded-full border-[10px] border-stone-50 relative flex items-center justify-center shadow-inner">
               <div className="text-center">
                  <p className="text-6xl font-black text-stone-900 tracking-tighter">88%</p>
                  <p className="text-[10px] font-black text-soft-sage uppercase tracking-[0.3em] mt-2">Optimal</p>
               </div>
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle 
                    cx="112" cy="112" r="101" fill="transparent" 
                    stroke="url(#trustGradient)" strokeWidth="10" 
                    strokeDasharray="635" strokeDashoffset="76" 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-in-out"
                 />
                 <defs>
                   <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#76897b" />
                     <stop offset="100%" stopColor="#d76445" />
                   </linearGradient>
                 </defs>
               </svg>
            </div>
          </div>

          <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100 space-y-3">
            <div className="flex items-center gap-3">
               <Info className="w-4 h-4 text-warm-clay" />
               <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Trust Insight</p>
            </div>
            <p className="text-[11px] font-medium text-stone-500 leading-relaxed font-serif italic text-balance">The network is prioritizing human comfort and precision, learning from our shared circle of review.</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Precision/Recall Chart */}
        <motion.div variants={item} className="bg-white rounded-[48px] border border-stone-100 p-10 shadow-xl shadow-stone-900/5 relative group">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black font-serif italic text-stone-900">Understanding Balance</h3>
              <p className="text-sm text-stone-400 font-medium italic font-serif">Sensitivity vs Gentle Awareness</p>
            </div>
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-terracotta group-hover:text-white transition-all">
               <Target className="w-6 h-6" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prCurve}>
                <defs>
                  <linearGradient id="colorPr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d76445" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#d76445" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fafaf9" />
                <XAxis dataKey="recall" stroke="#a8a29e" fontSize={10} axisLine={false} tickLine={false} tick={{ fontWeight: 800 }} />
                <YAxis stroke="#a8a29e" fontSize={10} axisLine={false} tickLine={false} tick={{ fontWeight: 800 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '20px', background: '#ffffff' }}
                />
                <Area type="monotone" dataKey="precision" stroke="#d76445" strokeWidth={4} fillOpacity={1} fill="url(#colorPr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Feature Importance HUD */}
        <motion.div variants={item} className="bg-white rounded-[48px] border border-stone-100 p-10 shadow-xl shadow-stone-900/5 relative group">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black font-serif italic text-stone-900">Key Considerations</h3>
              <p className="text-sm text-stone-400 font-medium italic font-serif">Nature of our predictive thoughts</p>
            </div>
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-warm-clay group-hover:text-white transition-all">
               <BrainCircuit className="w-6 h-6" />
            </div>
          </div>
          <div className="space-y-8">
             {featureImpact.map((item, i) => (
                <div key={item.name} className="space-y-3">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-stone-400">{item.name}</span>
                      <span className="text-stone-900">{item.value}% Relevance</span>
                   </div>
                   <div className="h-5 bg-stone-50 rounded-full overflow-hidden border border-stone-100 p-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1.5, ease: "anticipate", delay: 0.5 + (i * 0.1) }}
                        className="h-full bg-stone-900 rounded-full relative"
                      >
                         <div className="absolute right-0 top-0 bottom-0 w-1 bg-terracotta opacity-50"></div>
                      </motion.div>
                   </div>
                </div>
             ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
