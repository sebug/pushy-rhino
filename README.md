# Pushy Rhino
Sample project that explores Safari's new capability for web push.

Done as a static web app, I guess.

You'll also need access to an Azure Storage account for table storage (that's where we'll put the push subscriptions).

Save the following environment variables:

TABLES_PRIMARY_STORAGE_ACCOUNT_KEY
TABLES_STORAGE_ACCOUNT_NAME
TABLES_STORAGE_ENDPOINT_SUFFIX


## Creating the VAPID keypair
Doing this directly in the GitHub dev container - go to generate_keys and do
    
    npm ci

then open node

    const webPush = require('web-push');
    const vapidKeys = webPush.generateVAPIDKeys()

store the public, private keys. The public key goes into main.js
