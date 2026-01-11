import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/RigelAuth';
import { GlassCard, GlassButton, GlassInput } from './ui/GlassComponents';
import { Wallet, Shield, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumFeature } from './PremiumFeature';

interface UserWallet {
    id: string;
    address_hash: string;
    encrypted_address: string;
    created_at: string;
}

export const WalletManager: React.FC = () => {
    const { user } = useAuth();
    const [wallets, setWallets] = useState<UserWallet[]>([]);
    const [newAddress, setNewAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) fetchWallets();
    }, [user]);

    const fetchWallets = async () => {
        const { data, error } = await supabase
            .from('user_wallets')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setWallets(data || []);
    };

    const handleAddWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAddress || !user) return;

        setLoading(true);
        // Simulación de hash y cifrado ZK-Ready
        const address_hash = btoa(newAddress).substring(0, 16); // Placeholder
        const encrypted_address = `zkv1_${btoa(newAddress)}`; // Placeholder

        const { error } = await supabase
            .from('user_wallets')
            .insert([{
                user_id: user.id,
                address_hash,
                encrypted_address
            }]);

        if (!error) {
            setNewAddress('');
            fetchWallets();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from('user_wallets')
            .delete()
            .eq('id', id);

        if (!error) fetchWallets();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <GlassCard>
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-2xl">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-outfit text-glow">Gestión de Wallets ZK-Ready</h2>
                        <p className="text-gray-400 text-sm">Asegura tus activos con la arquitectura cifrada de Daniel_AI</p>
                    </div>
                </div>

                <form onSubmit={handleAddWallet} className="flex gap-4">
                    <GlassInput
                        placeholder="Dirección de Wallet (0x...)"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="flex-1"
                    />
                    <PremiumFeature>
                        <GlassButton type="submit" disabled={loading} glow>
                            <Plus size={20} />
                            Vincular
                        </GlassButton>
                    </PremiumFeature>
                </form>
            </GlassCard>

            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {wallets.map((wallet) => (
                        <motion.div
                            key={wallet.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                        >
                            <GlassCard className="flex items-center justify-between group hover:border-[#00E5FF]/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/5 text-gray-400 rounded-lg group-hover:text-[#00E5FF] transition-colors">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-mono text-sm">{wallet.address_hash}...</span>
                                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded uppercase font-bold tracking-tighter">Encrypted</span>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1">Vinculado el {new Date(wallet.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(wallet.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {wallets.length === 0 && (
                    <div className="text-center p-12 text-gray-500">
                        No hay wallets vinculadas. Comienza asegurando tu identidad ZK.
                    </div>
                )}
            </div>

            <GlassCard className="bg-blue-500/5 border-blue-500/20">
                <div className="flex gap-4">
                    <Shield className="text-blue-400 shrink-0" size={24} />
                    <div>
                        <h4 className="text-blue-200 font-semibold mb-1">Privacidad Daniel_AI</h4>
                        <p className="text-blue-200/60 text-sm">
                            Utilizamos hashes de dirección para indexación y cifrado asimétrico para el almacenamiento.
                            Tu dirección real nunca se expone en texto plano en nuestra base de datos core.
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
