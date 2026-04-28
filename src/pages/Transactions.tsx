import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Tag,
  MapPin,
  Clock,
  Shield,
  ExternalLink,
  User,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from '@/src/components/Skeleton';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 }
};

export default function Transactions({ transactions, loading, onResolve }: { transactions: any[], loading?: boolean, onResolve: (id: string, status: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'FRAUD' | 'SAFE'>('ALL');
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.tx_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterMode === 'ALL' || 
                           (filterMode === 'FRAUD' && t.prob > 0.7) ||
                           (filterMode === 'SAFE' && t.prob <= 0.4);
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filterMode]);

  const selectedTx = useMemo(() => 
    transactions.find(t => t.tx_id === selectedTxId), 
  [transactions, selectedTxId]);

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
           <h2 className="text-3xl font-black tracking-tight text-stone-900 font-serif italic">Review Circle</h2>
           <p className="text-stone-500 font-medium mt-1 text-sm">Refining our understanding through human perspective.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-stone-900 transition-colors" />
              <input 
                type="text" 
                placeholder="Find a case..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-stone-100 rounded-[16px] focus:ring-4 focus:ring-stone-900/5 outline-none transition-all font-bold text-xs shadow-sm min-w-[240px]"
              />
           </div>
           <div className="flex bg-stone-100 p-1 rounded-[16px]">
             {(['ALL', 'FRAUD', 'SAFE'] as const).map((mode) => (
               <button 
                 key={mode}
                 onClick={() => setFilterMode(mode)}
                 className={cn(
                   "px-4 py-2 rounded-[12px] text-[9px] font-black uppercase tracking-widest transition-all",
                   filterMode === mode 
                     ? "bg-white text-stone-900 shadow-sm" 
                     : "text-stone-400 hover:text-stone-900"
                 )}
               >
                 {mode === 'FRAUD' ? 'Concerns' : mode === 'SAFE' ? 'Trusted' : 'Collective'}
               </button>
             ))}
           </div>
        </div>
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <motion.div variants={item} className="flex-1 bg-white rounded-[40px] border border-stone-100 shadow-xl shadow-stone-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-widest border-b border-stone-100">
                  <th className="px-8 py-6">Observation</th>
                  <th className="px-8 py-6">Source</th>
                  <th className="px-8 py-6 text-center">Inference</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Value</th>
                  <th className="px-8 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-8 py-6"><Skeleton className="h-10 w-48 rounded-xl" /></td>
                      <td className="px-8 py-6"><Skeleton className="h-10 w-48 rounded-xl" /></td>
                      <td className="px-8 py-6"><Skeleton className="h-4 w-24 mx-auto rounded-full" /></td>
                      <td className="px-8 py-6"><Skeleton className="h-8 w-24 mx-auto rounded-full" /></td>
                      <td className="px-8 py-6 text-right"><Skeleton className="h-4 w-16 ml-auto rounded-full" /></td>
                      <td className="px-8 py-6"></td>
                    </tr>
                  ))
                ) : (
                  filtered.map((tx) => (
                    <tr 
                      key={tx.tx_id} 
                      onClick={() => setSelectedTxId(tx.tx_id)}
                      className={cn(
                        "hover:bg-stone-50 transition-all cursor-pointer group",
                        selectedTxId === tx.tx_id && "bg-stone-50"
                      )}
                    >
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                            tx.prob > 0.7 ? "bg-terracotta text-white" : "bg-stone-100 text-stone-400"
                          )}>
                            <Zap className={cn("w-5 h-5", tx.prob > 0.7 && "animate-pulse")} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-stone-900">{tx.tx_id}</p>
                            <div className="flex items-center gap-2 mt-1 opacity-40">
                               <Clock className="w-3 h-3" />
                               <p className="text-[9px] font-black uppercase tracking-widest">
                                 {format(new Date(tx.timestamp), 'h:mm:ss a')}
                               </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <p className="text-sm font-black text-stone-900 leading-tight">{tx.merchant}</p>
                        <p className="text-[10px] font-bold text-stone-400 tracking-tight mt-1">{tx.location}</p>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col items-center">
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest mb-2 px-2 py-0.5 rounded-full",
                            tx.prob > 0.7 ? "text-terracotta" : (tx.prob > 0.4 ? "text-warm-clay" : "text-soft-sage")
                          )}>{(tx.prob * 100).toFixed(0)}% Concern</span>
                          <div className="w-20 h-1 bg-stone-100 rounded-full overflow-hidden">
                            <div className={cn(
                              "h-full transition-all duration-1000 ease-out",
                              tx.prob > 0.7 ? "bg-terracotta" : (tx.prob > 0.4 ? "bg-warm-clay" : "bg-soft-sage")
                            )} style={{ width: `${tx.prob * 100}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex justify-center">
                          <span className={cn(
                            "px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border",
                            tx.prob > 0.7 ? "bg-terracotta/5 text-terracotta border-terracotta/10" : 
                            (tx.prob > 0.4 ? "bg-warm-clay/5 text-warm-clay border-warm-clay/10" : "bg-soft-sage/5 text-soft-sage border-soft-sage/10")
                          )}>
                            {tx.prob > 0.7 ? "Observation" : (tx.prob > 0.4 ? "Review" : "Trusted")}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <p className="text-base font-black text-stone-900 tracking-tighter">${tx.amount.toFixed(2)}</p>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <button className="p-3 bg-stone-50 text-stone-300 rounded-2xl group-hover:bg-stone-900 group-hover:text-white transition-all shadow-sm">
                           <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="p-32 text-center space-y-6">
              <div className="w-24 h-24 bg-stone-50 border-2 border-dashed border-stone-200 rounded-[40px] flex items-center justify-center mx-auto animate-pulse">
                <Shield className="w-10 h-10 text-stone-200" />
              </div>
              <div>
                 <h4 className="text-xl font-black text-stone-900">Buffer Clear</h4>
                 <p className="text-sm font-medium text-stone-400 mt-1 uppercase tracking-widest font-black">Everything is peaceful right now</p>
              </div>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {selectedTx && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="w-full xl:w-[450px] bg-stone-900 rounded-[48px] p-12 text-white shadow-2xl shrink-0 sticky top-10 clay-shadow"
            >
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                       <Shield className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black font-serif italic text-white/90">Case Insight</h3>
                       <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-1">Refining Understanding</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-12">
                 <div className="bg-white/5 rounded-[40px] p-10 border border-white/5 relative overflow-hidden">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Instance Identity</p>
                    <h4 className="text-2xl font-black mb-2 text-white/90">{selectedTx.tx_id}</h4>
                    <p className="text-2xl font-black text-terracotta tracking-tighter">${selectedTx.amount.toFixed(2)}</p>
                    
                    <div className="grid grid-cols-2 gap-8 mt-10">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Time Node</p>
                          <p className="text-xs font-bold font-mono text-white/60">{format(new Date(selectedTx.timestamp), 'HH:mm:ss')}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Place Node</p>
                          <p className="text-xs font-bold text-white/60">{selectedTx.location}</p>
                       </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta opacity-[0.05] blur-3xl rounded-full"></div>
                 </div>

                 <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <Zap className="w-4 h-4 text-terracotta" />
                       <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Inference Context</h5>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5">
                          <div className="flex items-center gap-4 text-white/50">
                             <User className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">History</span>
                          </div>
                          <span className="text-[10px] font-black text-soft-sage uppercase tracking-widest">Nominal</span>
                       </div>
                       <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5">
                          <div className="flex items-center gap-4 text-white/50">
                             <History className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Pattern</span>
                          </div>
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", selectedTx.prob > 0.7 ? "text-terracotta" : "text-soft-sage")}>
                             {selectedTx.prob > 0.7 ? "Outlier" : "Nominal"}
                          </span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-12 border-t border-white/10 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                       <button 
                        onClick={() => { onResolve(selectedTx.tx_id, 'RESOLVED'); setSelectedTxId(null); }}
                        className="w-full p-6 bg-white text-stone-900 rounded-[28px] font-black uppercase text-[10px] tracking-widest hover:bg-stone-50 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-xl shadow-white/5"
                       >
                          <CheckCircle className="w-5 h-5 text-soft-sage" />
                          Trust & Verify
                       </button>
                       <button 
                        onClick={() => { onResolve(selectedTx.tx_id, 'FRAUD'); setSelectedTxId(null); }}
                        className="w-full p-6 bg-stone-800 text-white rounded-[28px] font-black uppercase text-[10px] tracking-widest hover:bg-stone-700 transition-all flex items-center justify-center gap-4 active:scale-95 border border-white/10"
                       >
                          <AlertCircle className="w-5 h-5 text-terracotta" />
                          Gentle Flag
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
