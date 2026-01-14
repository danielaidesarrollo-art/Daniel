import { useState, useEffect } from 'react'
import './App.css'
import VoiceMic from './components/VoiceMic'
import SentinelHistory from './components/SentinelHistory'
import { SynthesisService } from './services/SynthesisService'
import { DanielVoiceService } from './services/DanielVoiceService'
import { SentinelService } from './services/SentinelService'
import type { MacroEvent } from './services/SentinelService'
import { Wallet, Fuel, ShieldCheck, Activity, Eye, Play } from 'lucide-react'

function App() {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [balance] = useState(18759);
  const [gasExpenses] = useState("Registrados con éxito");
  const [isSentinelActive] = useState(true);
  const [walletAddress, setWalletAddress] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');

  useEffect(() => {
    // Initialize Daniel's special voice clone
    DanielVoiceService.configureVoice();
  }, []);

  const handleTranscript = (transcript: string) => {
    setLastTranscript(transcript);

    // Logic to respond to balance/gas queries
    const text = transcript.toLowerCase();
    if (text.includes('estado') || text.includes('saldo') || text.includes('dinero') || text.includes('gas')) {
      SynthesisService.confirmStatus(balance, gasExpenses);
    }
  };

  const simulateHighPriorityEvent = () => {
    const event: MacroEvent = {
      id: Date.now().toString(),
      description: "Alerta de Inflación en EE.UU. supera expectativas (9.1%)",
      category: 'Inflation',
      impact: 12.5,
      timestamp: Date.now()
    };
    SentinelService.analyzeEvent(event);
    // Force re-render of history - in a real app would use a store or state management
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className={`glass-card max-w-4xl w-full transition-all duration-700 ${isListening ? 'border-emerald-500/30' : 'border-white/10'}`}>
        <header className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isListening ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'}`}>
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Daniel <span className="text-slate-500 font-normal">Core</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={simulateHighPriorityEvent}
                className="stitch-button-primary text-xs font-bold uppercase"
              >
                <Play size={14} /> SIMULAR MACRO
              </button>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <div className={`listening-indicator ${isSentinelActive ? 'animate-pulse' : 'opacity-50'}`}></div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Sentinela {isSentinelActive ? 'Activo' : 'En espera'}</span>
              </div>
            </div>
          </div>

          <div className="p-1 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all duration-300">
              <div className="text-slate-500">
                <Wallet size={18} />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Dirección de Wallet</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Ingrese dirección de wallet..."
                  className="bg-transparent border-none outline-none text-sm font-mono text-emerald-400 placeholder:text-slate-600 w-full"
                />
              </div>
              <div className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                Sincronización Lista
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Wallet size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500">Balance Total</p>
                  <p className="text-xl font-semibold">$ {balance.toLocaleString('es-CO')} COP</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Fuel size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500">Gastos de Gas</p>
                  <p className="text-xl font-semibold text-emerald-400">Verificados</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/20 border border-white/5 min-h-[120px] flex flex-col items-center justify-center text-center">
              {isListening ? (
                <p className="text-emerald-400 animate-pulse font-medium">Escuchando órdenes de Daniel...</p>
              ) : lastTranscript ? (
                <p className="text-slate-300 italic">"{lastTranscript}"</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-slate-500">Protocolo Sentinela operando en segundo plano</p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">Listo para señales macro</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 border-l border-white/5 pl-6">
            <SentinelHistory />
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-slate-500 text-xs">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            <span>Sentinela v1.0.1 • Época 15</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Eye size={12} /> Beefy Sync</span>
            <span>v2.0.0-Stitch</span>
          </div>
        </footer>
      </div>

      <VoiceMic
        onTranscript={handleTranscript}
        isListening={isListening}
        setIsListening={setIsListening}
      />
    </div>
  )
}

export default App

