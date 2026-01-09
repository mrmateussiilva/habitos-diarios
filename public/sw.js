/**
 * Service Worker para PWA
 * Gerencia cache offline e funcionalidade de instalação
 * 
 * O Vite Plugin PWA gera automaticamente este arquivo durante o build,
 * mas este arquivo serve como fallback para desenvolvimento
 */

// Nome da cache e versão
const CACHE_NAME = 'habitos-diarios-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/styles/style.css'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Erro ao cachear recursos:', error);
      })
  );
  // Força o novo service worker a ativar imediatamente
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Toma controle de todas as páginas imediatamente
  return self.clients.claim();
});

// Estratégia de cache: Network First, fallback para Cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clona a resposta porque ela é um stream
        const responseToCache = response.clone();

        // Adiciona ao cache se for uma resposta válida
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // Se a rede falhar, tenta buscar do cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Se não encontrar no cache, retorna uma resposta padrão
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Notificações push (para futuras implementações)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'habit-notification',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('Hábitos Diários', options)
  );
});

// Clique em notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

