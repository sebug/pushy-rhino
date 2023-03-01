const openMainDB = () => {
    return new Promise((resolve, reject) => {
        if (!self.indexedDB) {
            reject('IndexedDB not available.');
            return;
        }
        let openDBRequest = self.indexedDB.open('messages', 1);
        openDBRequest.onerror = (event) => {
            reject(event);
        };
        openDBRequest.onsuccess = (event) => {
            resolve(openDBRequest.result);
        };
        openDBRequest.onupgradeneeded = (event) => {
            let db = openDBRequest.result;
            let messageObjectStore;
            if (event.oldVersion < 1) {
                messageObjectStore = db.createObjectStore('messages', {
                    keyPath: "messageID"
                });
            }
        };
    });
};

const getAllByObjectStoreNameIndex = async (objectStoreName, indexName) => {
    let db = await openMainDB();
    return await new Promise((resolve, reject) => {
        try {
            let objectStore = db.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
            let index = objectStore.index(indexName);
            let cursorRequest = index.openCursor();
            let entries = [];
            cursorRequest.onsuccess = (ev) => {
                let cursor = cursorRequest.result;
                if (cursor) {
                    entries.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(entries);
                }
            };
            cursorRequest.onerror = (err) => {
                resolve(err);
            };
        } catch (e) {
            reject(e);
        }
    });
};

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
        let messages = await getAllByObjectStoreNameIndex('messages', 'messageID');
        console.log(messages);

        let replacementText = '<ul>';
        for (let message of messages) {
            replacementText += '<li>' + message.content + '</li>';
        }
        replacementText += '</ul>';

        responseText = responseText.replace('<!-- messages-placeholder -->', replacementText);
        response = new Response(responseText, response);
    }

    return response;
}

self.addEventListener('fetch', (event) => {
    console.log(event.request);
    event.respondWith(fillInTemplate(event.request));
});
