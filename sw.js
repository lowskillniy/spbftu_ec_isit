const cacheName = 'cache-ecpred-isit';

const assetUrls = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/calc.js',
  '/css/style.css',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/res/ico/android/android-launchericon-72-72.png',
  '/res/ico/android/android-launchericon-144-144.png',
  '/res/ico/android/android-launchericon-192-192.png',
  '/res/ico/android/android-launchericon-512-512.png',
  '/res/ico/ios/16.png',
  '/res/ico/ios/32.png',
  '/res/ico/ios/58.png',
  '/res/ico/ios/64.png',
  '/res/ico/ios/76.png',
  '/res/ico/ios/80.png',
  '/res/ico/ios/87.png',
  '/res/ico/ios/114.png',
  '/res/ico/ios/120.png',
  '/res/ico/ios/128.png',
  '/res/ico/ios/144.png',
  '/res/ico/ios/152.png',
  '/res/ico/ios/167.png',
  '/res/ico/ios/180.png',
  '/res/ico/ios/192.png',
  '/res/ico/ios/256.png',
  '/res/ico/ios/512.png',
  '/res/ico/ios/1024.png'
];

self.addEventListener('install', async event => {
  const cache = await caches.open(cacheName);
  await cache.addAll(assetUrls);
});

self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name !== cacheName)
      .map(name => caches.delete(name))
  )
}); 

self.addEventListener('fetch', event => {
  event.respondWith(caches.open(cacheName).then(async cache => {
    try {
      const fetchedResponse = await fetch(event.request.url);
      cache.put(event.request, fetchedResponse.clone());
      return fetchedResponse;
    } catch {
      return await cache.match(event.request.url);
    }
  }));
});