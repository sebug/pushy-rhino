# Pushy Rhino
Sample project that explores Safari's new capability for web push.

Done as a static web app, I guess.

## Creating the VAPID keypair
Doing this directly in the GitHub dev container - go to generate_keys and do
    
    npm ci

then open node

    const webPush = require('web-push');
    const vapidKeys = webPush.generateVAPIDKeys()

store the public, private keys. The public key goes into main.js
