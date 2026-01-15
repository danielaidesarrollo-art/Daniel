// Service Worker para Daniel Core PWA
const CACHE_NAME = 'daniel-core-v1.0.1';
const RUNTIME_CACHE = 'daniel-runtime-v1';

// Recursos críticos para cachear durante la instalación
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
                    })
                    .map((cacheName) => {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia de caché: Network First con fallback a caché
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar requests que no sean GET
    if (request.method !== 'GET') {
        return;
    }

    // Ignorar requests a APIs externas (GPT-SoVITS, etc)
    if (url.pathname.startsWith('/sovits') ||
        url.pathname.startsWith('/api') ||
        url.hostname !== self.location.hostname) {
        return;
    }

    event.respondWith(
        caches.open(RUNTIME_CACHE).then((cache) => {
            return fetch(request)
                .then((response) => {
                    // Si la respuesta es válida, clonarla y guardarla en caché
                    if (response && response.status === 200) {
                        cache.put(request, response.clone());
                    }
                    return response;
                })
                .catch(() => {
                    // Si falla la red, intentar servir desde caché
                    return caches.match(request).then((cachedResponse) => {
                        if (cachedResponse) {
                            console.log('[SW] Serving from cache:', request.url);
                            return cachedResponse;
                        }

                        // Si no hay caché, devolver página offline básica
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
                });
        })
    );
});

// Manejo de mensajes desde el cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

// Sincronización en segundo plano (para futuras features)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    if (event.tag === 'sync-sentinel-data') {
        event.waitUntil(syncSentinelData());
    }
});

async function syncSentinelData() {
    // Placeholder para sincronización de datos del Sentinela
    console.log('[SW] Syncing Sentinel data...');
    return Promise.resolve();
}
