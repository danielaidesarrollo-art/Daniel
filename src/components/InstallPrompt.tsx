import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { PWAService } from '../services/PWAService';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Verificar si ya está instalado
        if (PWAService.isInstalled()) {
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Mostrar el prompt después de 10 segundos
            setTimeout(() => {
                setShowPrompt(true);
            }, 10000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`[PWA] Install prompt outcome: ${outcome}`);
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Volver a mostrar después de 24 horas
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    if (!showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
            <div className="glass-card border-emerald-500/30 p-4">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Download className="text-emerald-500" size={24} />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">Instalar Daniel Core</h3>
                        <p className="text-sm text-slate-400 mb-3">
                            Instala la app para acceso rápido y funcionalidad offline
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleInstall}
                                className="stitch-button-primary text-xs px-4 py-2"
                            >
                                Instalar
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
                            >
                                Ahora no
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="text-slate-500 hover:text-white transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
