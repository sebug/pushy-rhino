const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: "/"
            });
            if (registration.installing) {
                console.log('installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        } catch (error) {
            console.error(`Registration failed with {error}`);
        }
    }
};

registerServiceWorker();

let registerButton = document.querySelector('.register-for-push');
if (registerButton) {
    registerButton.addEventListener('click', async (ev) => {
        const appKey = Uint8Array.from(atob('MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEOx4QkFrSTUI5iUxj25v7r5kcxcvAgwTvfQM+pLzIVRcTVFDIG0Vozkm/rh+JNd5UbqLM3PPfNHPBbqQzoZivLA=='), c => c.charCodeAt(0));
        console.log(appKey);
        if (window.Notification) {
            let requestPermissionResult = await window.Notification.requestPermission();
            if (requestPermissionResult === 'granted') {
                const serviceWorkerRegistration = await navigator.serviceWorker.ready;
                const pushSubscription = await serviceWorkerRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: appKey
                });
                console.log(pushSubscription);
            }
        }
    });
}