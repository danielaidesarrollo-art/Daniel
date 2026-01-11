import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { GlassCard } from './ui/GlassComponents';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe } from 'lucide-react';

interface MarketData {
    country: string;
    total_subscribers: number;
    projected_monthly_revenue_usd: number;
    payment_methods_breakdown: {
        nequi: number;
        card: number;
        crypto: number;
    };
}

export const MarketOverview: React.FC = () => {
    const [data, setData] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: overview, error } = await supabase
                .from('admin_market_overview')
                .select('*');

            if (!error && overview) {
                setData(overview as MarketData[]);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="text-[#00E5FF] animate-pulse font-outfit">Consultando Inteligencia de Mercado...</div>
        </div>
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.projected_monthly_revenue_usd, 0);
    const totalSubs = data.reduce((acc, curr) => acc + curr.total_subscribers, 0);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard className="relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest">Revenue Proyectado</p>
                            <p className="text-2xl font-bold font-outfit text-glow">${totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest">Suscriptores Totales</p>
                            <p className="text-2xl font-bold font-outfit">{totalSubs}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Globe size={20} className="text-[#00E5FF]" />
                        Distribución por Región
                    </h3>
                    <div className="space-y-4">
                        {data.map((item, idx) => (
                            <motion.div
                                key={item.country}
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex justify-between text-sm">
                                    <span className="text-white">{item.country}</span>
                                    <span className="text-gray-400">${item.projected_monthly_revenue_usd}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#00E5FF] to-cyan-600"
                                        style={{ width: `${(item.projected_monthly_revenue_usd / totalRevenue) * 100}%` }}
                                    ></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-lg font-semibold mb-6">Métodos de Pago</h3>
                    <div className="space-y-6">
                        {['nequi', 'card', 'crypto'].map((method) => {
                            const count = data.reduce((acc, curr) => acc + (curr.payment_methods_breakdown[method as keyof typeof curr.payment_methods_breakdown] || 0), 0);
                            return (
                                <div key={method} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                                        <span className="text-sm text-gray-300 capitalize">{method}</span>
                                    </div>
                                    <span className="text-white font-medium">{count} users</span>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
