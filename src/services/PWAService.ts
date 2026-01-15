// PWA Registration and Utilities
export class PWAService {
    private static registration: ServiceWorkerRegistration | null = null;

    /**
     * Registra el Service Worker para PWA
     */
    static async registerServiceWorker(): Promise<void> {
        if (!('serviceWorker' in navigator)) {
            console.warn('[PWA] Service Workers no soportados en este navegador');
            return;
        }

        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('[PWA] Service Worker registrado:', this.registration.scope);

            // Escuchar actualizaciones del SW
            this.registration.addEventListener('updatefound', () => {
                const newWorker = this.registration?.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[PWA] Nueva versión disponible');
                            // Aquí podrías mostrar un toast al usuario
                            this.notifyUpdate();
                        }
                    });
                }
            });

            // Verificar actualizaciones cada hora
            setInterval(() => {
                this.registration?.update();
            }, 60 * 60 * 1000);

        } catch (error) {
            console.error('[PWA] Error al registrar Service Worker:', error);
        }
    }

    /**
     * Notifica al usuario sobre una actualización disponible
     */
    private static notifyUpdate(): void {
        const shouldUpdate = confirm(
            '¡Nueva versión de Daniel Core disponible! ¿Deseas actualizar ahora?'
        );

        if (shouldUpdate && this.registration?.waiting) {
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    /**
     * Verifica si la app está instalada como PWA
     */
    static isInstalled(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;
    }

    /**
     * Solicita permisos de notificación
     */
    static async requestNotificationPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            console.warn('[PWA] Notificaciones no soportadas');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission;
        }

        return Notification.permission;
    }

    /**
     * Muestra una notificación
     */
    static async showNotification(title: string, options?: NotificationOptions): Promise<void> {
        const permission = await this.requestNotificationPermission();

        if (permission === 'granted' && this.registration) {
            await this.registration.showNotification(title, {
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                ...options
            });
        }
    }

    /**
     * Limpia el caché del Service Worker
     */
    static async clearCache(): Promise<void> {
        if (this.registration?.active) {
            this.registration.active.postMessage({ type: 'CLEAR_CACHE' });
            console.log('[PWA] Caché limpiado');
        }
    }

    /**
     * Verifica si hay conexión a internet
     */
    static isOnline(): boolean {
        return navigator.onLine;
    }

    /**
     * Escucha cambios en el estado de conexión
     */
    static onConnectionChange(callback: (isOnline: boolean) => void): void {
        window.addEventListener('online', () => callback(true));
        window.addEventListener('offline', () => callback(false));
    }

    /**
     * Detecta si el usuario está en un dispositivo móvil
     */
    static isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    }

    /**
     * Detecta el tipo de dispositivo
     */
    static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
        const ua = navigator.userAgent;

        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }

        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }

        return 'desktop';
    }

    /**
     * Solicita permisos de micrófono (necesario para la funcionalidad de voz)
     */
    static async requestMicrophonePermission(): Promise<boolean> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('[PWA] Error al solicitar permiso de micrófono:', error);
            return false;
        }
    }

    /**
     * Verifica si el navegador soporta Web Speech API
     */
    static supportsWebSpeech(): boolean {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
}
