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
	    'img/icon192.png',
        'messages.html'
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

const fillInTemplate = async (request) => {
    let response = await cacheFirst(request);

    if (request.url && request.url.toLowerCase().indexOf('messages.html') >= 0)
    {
        let responseText = await response.text();
        responseText = responseText.replace('<!-- messages-placeholder -->', '<ul><li>First Message</li></ul>');
        response = new Response(responseText, response);
    }

    return response;
}

self.addEventListener('fetch', (event) => {
    console.log(event.request);
    event.respondWith(fillInTemplate(event.request));
});
