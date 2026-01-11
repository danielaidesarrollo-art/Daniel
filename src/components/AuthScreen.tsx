import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { GlassCard, GlassButton, GlassInput, flowFadeIn } from './ui/GlassComponents';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setSuccess(true);
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-height-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.05),transparent)]">
            <motion.div {...flowFadeIn as any} className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00E5FF]/10 text-[#00E5FF] mb-4 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 font-outfit text-glow">RIGEL</h1>
                    <p className="text-gray-400">Plataforma de Trading Daniel_AI</p>
                </div>

                <GlassCard className="border-t border-white/10">
                    <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-xl">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={cn(
                                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                                isLogin ? "bg-[#00E5FF] text-[#0B0E14]" : "text-gray-400 hover:text-white"
                            )}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={cn(
                                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                                !isLogin ? "bg-[#00E5FF] text-[#0B0E14]" : "text-gray-400 hover:text-white"
                            )}
                        >
                            Registrarse
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <GlassInput
                            label="Correo Electrónico"
                            type="email"
                            placeholder="admin@daniel-ai.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <GlassInput
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm italic">
                                {error}
                            </motion.p>
                        )}

                        {success && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00E5FF] text-sm italic">
                                Registro exitoso. Revisa tu correo.
                            </motion.p>
                        )}

                        <GlassButton type="submit" className="w-full" disabled={loading} glow>
                            {loading ? 'Procesando...' : isLogin ? (
                                <>
                                    <LogIn size={18} />
                                    Ingresar al Core
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Crear Cuenta
                                </>
                            )}
                        </GlassButton>
                    </form>
                </GlassCard>

                <p className="mt-8 text-center text-xs text-gray-500 uppercase tracking-widest">
                    Desarrollado por Antigravity • Daniel_AI Ecosystem
                </p>
            </motion.div>
        </div>
    );
};

// Internal helper inside the same file for simplicity if not exported from components
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
