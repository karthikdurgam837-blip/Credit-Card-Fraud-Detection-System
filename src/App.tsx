import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  NavLink, 
  useLocation 
} from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  ShieldCheck,
  Menu,
  ChevronRight,
  User
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ModelPerformance from './pages/ModelPerformance';
import SettingsPage from './pages/Settings';

// --- TYPES ---
interface Transaction {
  tx_id: string;
  amount: number;
  merchant: string;
  category: string;
  location: string;
  prob: number;
  decision: string;
  timestamp: string;
}

const SidebarLink = ({ to, icon: Icon, label }: any) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex items-center gap-3 w-full p-4 rounded-2xl text-sm font-bold transition-all group",
      isActive ? "bg-stone-900 text-white shadow-xl shadow-stone-900/10" : "text-stone-400 hover:bg-stone-100/50 hover:text-stone-900"
    )}
  >
    {({ isActive }) => (
      <>
        <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-stone-300")} />
        <span className="tracking-tight">{label}</span>
      </>
    )}
  </NavLink>
);

const Layout = ({ children, lastUpdate }: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const pageTitle = useMemo(() => {
    switch(location.pathname) {
      case '/': return 'Our Community Care';
      case '/transactions': return 'Human Review Circle';
      case '/model': return 'Our Understanding';
      case '/settings': return 'Your Environment';
      default: return 'Safety Center';
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-stone-50 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-stone-100 flex flex-col z-50 fixed inset-y-0 transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-stone-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-stone-900/10 transition-transform hover:rotate-12">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="font-black text-lg tracking-tight text-stone-900">TrustWatch</h1>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <SidebarLink to="/" icon={LayoutDashboard} label={isSidebarOpen ? "Overview" : ""} />
          <SidebarLink to="/transactions" icon={CreditCard} label={isSidebarOpen ? "Review" : ""} />
          <SidebarLink to="/model" icon={BarChart3} label={isSidebarOpen ? "Logic" : ""} />
          <SidebarLink to="/settings" icon={Settings} label={isSidebarOpen ? "Preferences" : ""} />
        </nav>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-stone-100/50 rounded-2xl border border-stone-100 transition-all hover:bg-stone-100">
             <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-stone-900 shadow-sm">
                <User className="w-4 h-4" />
             </div>
             {isSidebarOpen && (
               <div>
                  <p className="text-xs font-bold text-stone-900">Admin</p>
               </div>
             )}
          </div>
          {isSidebarOpen && (
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] text-center px-4">
              Created by <span className="text-stone-400">D.KARTHIK</span>
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
        <header className="h-16 px-6 border-b border-stone-100 bg-white/10 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-stone-100 rounded-lg transition-all"
            >
              <Menu className="w-5 h-5 text-stone-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-terracotta rounded-full"></div>
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none">
                {format(lastUpdate, 'HH:mm:ss')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-white border border-stone-100 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all relative group">
              <Bell className="w-4 h-4" />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-terracotta rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white font-black text-[10px] uppercase">
              AS
            </div>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [config, setConfig] = useState<any>({ threshold: "0.7", simulation_speed: "4000" });

  const fetchData = async () => {
    try {
      const [txRes, configRes] = await Promise.all([
        fetch('/api/transactions?count=100'),
        fetch('/api/config')
      ]);
      const data = await txRes.json();
      const configData = await configRes.json();
      setTransactions(data);
      setConfig(configData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const resolveTransaction = async (id: string, status: string) => {
    try {
      await fetch(`/api/transactions/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
      toast.success(`Transaction ${id} marked as ${status.toLowerCase()}`, {
        description: 'The ledger has been updated successfully.'
      });
    } catch (err) {
      console.error("Resolve failed", err);
      toast.error('Failed to update transaction status');
    }
  };

  const updateConfig = async (newConfig: any) => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      fetchData();
      toast.success('System configuration saved', {
        description: 'Changes have been applied to the live neural engine.'
      });
    } catch (err) {
      console.error("Config update failed", err);
      toast.error('Failed to save settings');
    }
  };

  useEffect(() => {
    fetchData().then(() => setLoading(false));
    const interval = setInterval(() => fetchData(), config.simulation_speed || 4000);
    return () => clearInterval(interval);
  }, [config.simulation_speed]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-10"
      >
        <div className="relative">
          <div className="w-24 h-24 bg-stone-900 rounded-[32px] flex items-center justify-center animate-pulse clay-shadow shadow-2xl">
             <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 border-2 border-terracotta/20 rounded-[32px] scale-150 animate-ping opacity-10"></div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2 font-serif italic">TrustWatch Community</h1>
          <p className="text-stone-400 font-black tracking-[0.3em] text-[10px] uppercase">Waking collective understanding...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Layout lastUpdate={lastUpdate}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard transactions={transactions} loading={loading} />} />
            <Route path="/transactions" element={<Transactions transactions={transactions} loading={loading} onResolve={resolveTransaction} />} />
            <Route path="/model" element={<ModelPerformance />} />
            <Route path="/settings" element={<SettingsPage config={config} onUpdate={updateConfig} />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
}
