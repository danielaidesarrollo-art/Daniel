import { useState } from 'react';
import { useAuth } from './context/RigelAuth.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';
import { MarketOverview } from './components/MarketOverview.tsx';
import { WalletManager } from './components/WalletManager.tsx';
import { GemsAlarms } from './components/GemsAlarms.tsx';
import { GlassCard } from './components/ui/GlassComponents.tsx';
import { supabase } from './lib/supabaseClient';
import { LayoutDashboard, Wallet, BarChart3, LogOut, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const { user, loading, isTrial } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'market' | 'wallets' | 'gems'>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00E5FF]/20 border-t-[#00E5FF] rounded-full animate-spin shadow-[0_0_20px_rgba(0,229,255,0.2)]"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'market', label: 'Mercado (Admin)', icon: BarChart3 },
    { id: 'wallets', label: 'Wallets ZK', icon: Wallet },
    { id: 'gems', label: 'Gems Alarms', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl p-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00E5FF] rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.4)]"></div>
          <span className="font-outfit font-bold text-xl tracking-tight text-glow">RIGEL</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
              {item.id === 'gems' && isTrial && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#0B0E14]/80 backdrop-blur-md border-b border-white/5 p-4 md:p-6 flex justify-between items-center">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-6 h-6 bg-[#00E5FF] rounded shadow-[0_0_10px_rgba(0,229,255,0.4)]"></div>
            <span className="font-outfit font-bold text-lg">RIGEL</span>
          </div>

          <h2 className="hidden md:block text-xl font-bold font-outfit uppercase tracking-wider text-white/90">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h2>

          <div className="flex items-center gap-4">
            {isTrial && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                <Zap size={14} className="text-yellow-500" />
                <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-tighter">Modo Simulación Activo</span>
              </div>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">User</p>
              <p className="text-sm font-medium text-white/80">{user.email?.split('@')[0]}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-[#00E5FF]">{user.email?.[0].toUpperCase()}</span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GlassCard className="relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Estado del Mercado</h3>
                      <p className="text-3xl font-bold text-[#00E5FF] text-glow">OPERATIVO</p>
                      <p className="text-[10px] text-gray-500 mt-4">Actualizado hace unos segundos</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 text-[#00E5FF]/5 transition-transform group-hover:scale-110">
                      <BarChart3 size={120} />
                    </div>
                  </GlassCard>

                  <GlassCard>
                    <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Nivel de Acceso</h3>
                    <p className="text-3xl font-bold text-white uppercase">{isTrial ? 'Trial (Simulación)' : 'Pro (Ejecución)'}</p>
                  </GlassCard>
                </div>
              )}

              {activeTab === 'market' && <MarketOverview />}
              {activeTab === 'wallets' && <WalletManager />}
              {activeTab === 'gems' && <GemsAlarms />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
