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
            'style.css'
        ])
    );
});

self.addEventListener('fetch', (event) => {
    console.log(event.request);
    event.respondWith(caches.match(event.request));
});