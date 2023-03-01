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
        const appKey = 'BFMJcMisQcwup7ZplWPM4dWcFwtmK3FsR7n7JoRREpdzyaawdZ1HiUrFInjgHsZjcezCuM0hayxURDC3C4QJr5Q';
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