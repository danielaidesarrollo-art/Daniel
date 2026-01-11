import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassButton } from './GlassComponents';
import { ShieldCheck, Zap, X } from 'lucide-react';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#0B0E14]/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg"
                    >
                        <GlassCard className="border-[#00E5FF]/30 shadow-[0_0_50px_rgba(0,229,255,0.15)]">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center p-4">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#00E5FF]/10 text-[#00E5FF] mb-6 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                                    <ShieldCheck size={40} />
                                </div>

                                <h2 className="text-3xl font-bold font-outfit mb-4 text-glow">
                                    Infraestructura Lista
                                </h2>

                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    Tu infraestructura de seguridad está lista. Activa tu suscripción de <span className="text-[#00E5FF] font-bold">$1.3 USD</span> para pasar de la simulación a la ejecución real.
                                </p>

                                <div className="space-y-4">
                                    <GlassButton className="w-full py-4 text-lg" glow onClick={() => window.open('https://checkout.daniel-ai.com', '_blank')}>
                                        <Zap size={20} fill="currentColor" />
                                        Activar Acceso Premium
                                    </GlassButton>

                                    <p className="text-gray-500 text-xs uppercase tracking-tighter">
                                        Desbloquea Optimización en Tiempo Real y Alertas de Gemas
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
