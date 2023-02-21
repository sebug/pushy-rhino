const addResourcesToCache = async (resources) => {
    const cache = await caches.open('v1');
    await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
    event.waitUntil(
        addResourcesToCache([
            '/',
            '/index.html',
            'main.js',
            'style.css',
	    'img/icon48.png',
	    'img/icon72.png',
	    'img/icon96.png',
	    'img/icon144.png',
	    'img/icon168.png',
	    'img/icon192.png'
        ])
    );
});

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
    return fetch(request);
};

self.addEventListener('fetch', (event) => {
    console.log(event.request);
    event.respondWith(cacheFirst(event.request));
});
