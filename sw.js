const staticCacheName = 's-ecpred-isit';
const dynamicCacheName = 'd-ecpred-isit';

const assetUrls = [
  '/index.html',
  '/js/app.js',
  '/js/calc.js',
  '/css/style.css'
];

self.addEventListener('install', async event => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
});

self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .filter(name => name !== dynamicCacheName)
      .map(name => caches.delete(name))
  )
});

self.addEventListener("fetch", (event) => {
  const {request} = event;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(staticCacheFetch(request));
  } else {
    event.respondWith(dynamicCacheFetch(request));
  }
});

async function staticCacheFetch(request) {
  const cached = await caches.match(request);
  return cached ?? await fetch(request);
}

async function dynamicCacheFetch(request) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    return cached ?? undefined;
  }
}