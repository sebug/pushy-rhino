const openMainDB = () => {
    return new Promise((resolve, reject) => {
        if (!self.indexedDB) {
            reject('IndexedDB not available.');
            return;
        }
        let openDBRequest = self.indexedDB.open('messages', 3);
        openDBRequest.onerror = (event) => {
            reject(event);
        };
        openDBRequest.onsuccess = (event) => {
            resolve(openDBRequest.result);
        };
        openDBRequest.onupgradeneeded = (event) => {
            let db = openDBRequest.result;
            let messageObjectStore;
            let messageIDIndex;
            if (event.oldVersion < 1) {
                messageObjectStore = db.createObjectStore('messages', {
                    keyPath: "messageID",
                    autoIncrement: true
                });
            }
            if (event.oldVersion < 2) {
                if (!messageObjectStore) {
                    messageObjectStore = openDBRequest.transaction.objectStore('messages');
                }
                messageIDIndex = messageObjectStore.createIndex('by_messageID', [ 'messageID' ]);
            }
        };
    });
};

const getAllByObjectStoreName = async (objectStoreName) => {
    let db = await openMainDB();
    return await new Promise((resolve, reject) => {
        try {
            let objectStore = db.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
            let getAllResult = objectStore.getAll();
            getAllResult.onsuccess = (ev) => {
                resolve(ev.target.result);
            };
            getAllResult.onerror = (err) => {
                reject(err);
            };
        } catch (e) {
            reject(e);
        }
    });
};

const addResourcesToCache = async (resources) => {
    const cache = await caches.open('v7');
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
        'messages.html',
        'send_notification.html'
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
        let messages = await getAllByObjectStoreName('messages');
        console.log(messages);

        let replacementText = '<ul>';
        for (let i = messages.length - 1; i >= 0; i -= 1) {
            let message = messages[i];
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

const insertMessage = async (message) => {
    let db = await openMainDB();
    return await new Promise((resolve, reject) => {
        try {
            let objectStore = db.transaction(['messages'], 'readwrite').objectStore('messages');
            let insertResult = objectStore.add({
                content: message
            });
            insertResult.onsuccess = (ev) => {
                resolve(message);
            };
            insertResult.onerror = (err) => {
                reject(err);
            };
        } catch (e) {
            reject(e);
        }
    });
};

const saveAndShowNotification = async (event) => {
    const payload = event.data?.text() ?? "no payload";
    if (payload !== 'no payload') {
        // store in messages DB
        await insertMessage(payload);
    }
    return await self.registration.showNotification("Pushy Rhino", {
        body: payload
    });
};

self.addEventListener('push', (event) => {
    event.waitUntil(
        saveAndShowNotification(event)
    );
});