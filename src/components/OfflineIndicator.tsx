import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { PWAService } from '../services/PWAService';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(PWAService.isOnline());
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        PWAService.onConnectionChange((online) => {
            setIsOnline(online);
            setShowIndicator(true);

            // Ocultar después de 5 segundos si volvió online
            if (online) {
                setTimeout(() => setShowIndicator(false), 5000);
            }
        });
    }, []);

    if (!showIndicator && isOnline) return null;

    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${showIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${isOnline
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500'
                    : 'bg-amber-500/20 border-amber-500/30 text-amber-500'
                }`}>
                {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                <span className="text-xs font-medium">
                    {isOnline ? 'Conexión restaurada' : 'Modo offline'}
                </span>
            </div>
        </div>
    );
}
