# Pushy Rhino
Sample project that explores Safari's new capability for web push.

Done as a static web app, I guess.

## Creating the VAPID keypair
Doing this directly in the GitHub dev container that has openssl installed (be sure to back it up outside though). Instructions: https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/

    openssl ecparam -name prime256v1 -genkey -noout -out vapid_private.pem
    openssl ec -in vapid_private.pem -pubout -out vapid_public.pem