import React from 'react';
import { HistoryService } from '../services/HistoryService';
import type { HistoryEntry } from '../services/HistoryService';
import { Clock, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';

const SentinelHistory: React.FC = () => {
    const [history, setHistory] = React.useState<HistoryEntry[]>([]);

    React.useEffect(() => {
        setHistory(HistoryService.getHistory());
    }, []);

    if (history.length === 0) {
        return (
            <div className="p-8 text-center border border-white/5 rounded-2xl bg-white/5">
                <p className="text-slate-500 text-sm">No hay registros en el protocolo Sentinela.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
                <Clock size={16} className="text-emerald-500" />
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Historial Sentinela Macro</h3>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {history.map((entry, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                {entry.recommendation.priority === 'High' ? (
                                    <ShieldAlert size={14} className="text-rose-500" />
                                ) : (
                                    <TrendingUp size={14} className="text-emerald-500" />
                                )}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${entry.recommendation.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                    {entry.recommendation.priority === 'High' ? 'Prioridad Alta' : entry.event.category}
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                        </div>

                        <p className="text-xs text-slate-300 font-medium mb-1">{entry.event.description}</p>
                        <div className="flex items-start gap-2 bg-black/20 p-2 rounded-lg">
                            <CheckCircle2 size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-emerald-400/90 leading-tight">
                                <span className="font-bold">Acción:</span> {entry.recommendation.action}. {entry.recommendation.reason}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SentinelHistory;
