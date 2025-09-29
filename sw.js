/**
 * Service Worker pour l'application Suivi Salaires Infirmier
 * Permet le fonctionnement hors ligne basique
 */

const CACHE_NAME = 'nurse-salary-tracker-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/data-manager.js',
  './js/salary-manager.js',
  './manifest.json',
  // Font Awesome (CDN)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installation en cours...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Mise en cache des fichiers');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Service Worker: Erreur lors de la mise en cache', err);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Supprimer les anciens caches
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  // Stratégie Cache First pour les ressources statiques
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Retourner la ressource depuis le cache si disponible
          if (response) {
            return response;
          }
          
          // Sinon, faire la requête réseau
          return fetch(event.request)
            .then(response => {
              // Vérifier si la réponse est valide
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Cloner la réponse car elle ne peut être lue qu'une fois
              const responseToCache = response.clone();
              
              // Ajouter la réponse au cache pour les prochaines fois
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // En cas d'erreur réseau, retourner une page hors ligne basique
              if (event.request.destination === 'document') {
                return caches.match('./index.html');
              }
            });
        })
    );
  }
});

// Gestion des messages depuis l'application principale
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification de mise à jour disponible
self.addEventListener('controllerchange', () => {
  console.log('Service Worker: Nouvelle version disponible');
  
  // Optionnel: Notifier l'application principale
  if (self.clients) {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_UPDATED',
          message: 'Une nouvelle version de l\'application est disponible'
        });
      });
    });
  }
});