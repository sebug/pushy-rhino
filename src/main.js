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
    registerButton.addEventListener('click', (ev) => {
        const appKey = new Uint8Array(atob('MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEOx4QkFrSTUI5iUxj25v7r5kcxcvAgwTvfQM+pLzIVRcTVFDIG0Vozkm/rh+JNd5UbqLM3PPfNHPBbqQzoZivLA=='));
        console.log(appKey);
        if (window.Notification) {
            let requestPermissionResult = window.Notification.requestPermission();
            console.log(requestPermissionResult);
        }
    });
}