import React from 'react';
import { GlassCard, GlassButton } from './ui/GlassComponents.tsx';
import { PremiumFeature } from './PremiumFeature.tsx';
import { Sparkles, Bell, ArrowUpRight, Zap } from 'lucide-react';

export const GemsAlarms: React.FC = () => {
    const mockGems = [
        { name: 'Rigel Alpha', risk: 'Low', potential: '10x', id: 1 },
        { name: 'Stellar Pulse', risk: 'Medium', potential: '25x', id: 2 },
        { name: 'Nebula Core', risk: 'High', potential: '100x', id: 3 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold font-outfit text-glow flex items-center gap-3">
                        <Sparkles className="text-[#00E5FF]" />
                        Gems Alarms
                    </h2>
                    <p className="text-gray-400">Detección temprana de activos de alto potencial por Daniel_AI</p>
                </div>
                <PremiumFeature>
                    <GlassButton variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                        <Bell size={18} />
                        Configurar Alertas Globales
                    </GlassButton>
                </PremiumFeature>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGems.map((gem) => (
                    <GlassCard key={gem.id} className="relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles size={80} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-white">{gem.name}</h3>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${gem.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                                    gem.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    {gem.risk} RISK
                                </span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Potencial Estimado</span>
                                    <span className="text-[#00E5FF] font-bold">{gem.potential}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00E5FF]" style={{ width: gem.potential === '100x' ? '100%' : gem.potential === '25x' ? '40%' : '15%' }} />
                                </div>
                            </div>

                            <PremiumFeature>
                                <GlassButton className="w-full justify-between group-hover:bg-[#00E5FF] group-hover:text-[#0B0E14]">
                                    Ejecutar Optimización
                                    <ArrowUpRight size={18} />
                                </GlassButton>
                            </PremiumFeature>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <GlassCard className="bg-gradient-to-br from-[#00E5FF]/5 to-purple-500/5 border-white/5">
                <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#00E5FF]">
                        <Zap size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-1">Simulación Activa</h4>
                        <p className="text-gray-400 text-sm max-w-2xl">
                            Estás visualizando datos en tiempo real bajo el modo de Simulación Daniel_AI.
                            La ejecución directa en smart contracts requiere la activación de los protocolos de seguridad premium.
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
