import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Bell, 
  Database, 
  ShieldCheck,
  Save
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings({ config, onUpdate }: { config: any, onUpdate: (c: any) => void }) {
  const [formData, setFormData] = useState(config);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onUpdate(formData);
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight font-serif italic text-stone-900">Preferences</h2>
          <p className="text-stone-500 font-medium mt-2 max-w-sm italic font-serif leading-relaxed text-sm">Customize how TrustWatch aligns with your community's needs and values.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Detection Parameters */}
        <div className="bg-white rounded-[48px] border border-stone-100 p-10 shadow-xl shadow-stone-900/5 space-y-8 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900 group-hover:bg-terracotta group-hover:text-white transition-all shadow-sm">
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black font-serif italic">Awareness</h3>
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1">Our guiding logic</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] block mb-6">Trust Threshold</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.9" 
                  step="0.05"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  className="w-full h-2 bg-stone-100 rounded-full appearance-none cursor-pointer accent-stone-900"
                />
                <div className="flex justify-between mt-4">
                  <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Attentive</span>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-stone-900">{formData.threshold}</span>
                    <span className="text-[8px] font-black text-terracotta uppercase mt-1">Active</span>
                  </div>
                  <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Natural</span>
                </div>
              </div>

              <div className="pt-8 border-t border-stone-100">
                 <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Active Harmony</span>
                    <div className="w-12 h-6 bg-stone-100 rounded-full p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-soft-sage rounded-full shadow-sm" />
                    </div>
                 </div>
                 <p className="text-[11px] text-stone-400 font-medium leading-relaxed font-serif italic text-balance">Allow the system to automatically embrace moments with high confidence without manual review.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Settings */}
        <div className="bg-white rounded-[48px] border border-stone-100 p-10 shadow-xl shadow-stone-900/5 space-y-8 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900 group-hover:bg-warm-clay group-hover:text-white transition-all shadow-sm">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black font-serif italic">Pulse</h3>
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1">Speed of life</p>
              </div>
            </div>

            <div className="space-y-8">
               <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] block mb-6">Heartbeat Rate</label>
                  <select 
                    value={formData.simulation_speed}
                    onChange={(e) => setFormData({ ...formData, simulation_speed: e.target.value })}
                    className="w-full p-5 bg-stone-50 rounded-3xl font-black text-xs outline-none hover:bg-stone-100 transition-all appearance-none text-stone-900"
                  >
                    <option value="1000">Brisk (1s Delay)</option>
                    <option value="2000">Active (2s Delay)</option>
                    <option value="4000">Steady (4s Delay)</option>
                    <option value="10000">Calm (10s Delay)</option>
                  </select>
               </div>

               <div className="pt-8 border-t border-stone-100">
                 <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Global Influence</span>
                    <span className="text-[9px] font-black text-warm-clay px-3 py-1 bg-warm-clay/10 rounded-full tracking-wider uppercase">Active Circle: SF</span>
                 </div>
                 <p className="text-[11px] text-stone-400 font-medium leading-relaxed font-serif italic text-balance">The heartbeat is currently reflecting the vibrant pace of high-tech metropolitan life.</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="md:col-span-2 bg-stone-900 text-white rounded-3xl p-6 font-black tracking-[0.3em] uppercase text-xs flex items-center justify-center gap-4 hover:bg-stone-800 transition-all active:scale-[0.98] shadow-2xl shadow-stone-900/10 disabled:opacity-50 h-20"
        >
          {saving ? (
             <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? 'Applying...' : 'Apply Preferences'}
        </button>
      </form>

      {/* System Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
         <div className="p-8 bg-stone-50 rounded-[40px] border border-stone-100 flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
               <Database className="w-6 h-6 text-stone-900" />
            </div>
            <div>
               <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Knowledge</p>
               <p className="text-sm font-black text-stone-900 tracking-tight">Collective Core</p>
            </div>
         </div>
         <div className="p-8 bg-stone-50 rounded-[40px] border border-stone-100 flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
               <ShieldCheck className="w-6 h-6 text-soft-sage" />
            </div>
            <div>
               <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Bond</p>
               <p className="text-sm font-black text-stone-900 tracking-tight">Invisibly Secure</p>
            </div>
         </div>
          <div className="p-8 bg-stone-50 rounded-[40px] border border-stone-100 flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
               <Bell className="w-6 h-6 text-terracotta" />
            </div>
            <div>
               <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Outreach</p>
               <p className="text-sm font-black text-stone-900 tracking-tight">Active Pulse</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
