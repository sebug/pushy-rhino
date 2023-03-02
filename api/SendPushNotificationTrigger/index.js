const { parse } = require('qs');
const webpush = require('web-push');

async function sendNotification(context, message, publicKey, privateKey) {
    try {
        const account = process.env.TABLES_STORAGE_ACCOUNT_NAME;
        const accountKey = process.env.TABLES_PRIMARY_STORAGE_ACCOUNT_KEY;
        const suffix = process.env.TABLES_STORAGE_ENDPOINT_SUFFIX;
    
        const url = 'https://' + account + '.table.' + suffix;

        const urlSafePublicKey = publicKey.replaceAll('+', '-')
            .replaceAll('/', '_');
        const urlSafePrivateKey = privateKey.replaceAll('+', '-')
        .replaceAll('/', '_');
    
        const credential = new AzureNamedKeyCredential(account, accountKey);
        const serviceClient = new TableServiceClient(
            url,
            credential
        );
    
        const tableName = 'endpoints';
        await serviceClient.createTable(tableName, {
            onResponse: (response) => {
                if (response.status === 409) {
                    context.log('Table endpoints already exists');
                }
            }
        });
        const tableClient = new TableClient(url, tableName, credential);
        let entitiesIter = tableClient.listEntities();
        for await (const entity of entitiesIter) {
            let options = {
                vapidDetails: {
                    subject: 'https://ashy-sky-0a409fd03.2.azurestaticapps.net/',
                    publicKey: urlSafePublicKey,
                    privateKey: urlSafePrivateKey
                }
            };
            let pushSubscription = {
                endpoint: entity.endpoint,
                keys: {
                    authKey: entity.authKey,
                    p256dh: entity.p256dh
                }
            };
            webpush.sendNotification(pushSubscription, message, options);
        }
    } catch (err) {
        context.log(err);
        throw err;
    }
}

module.exports = async function (context, req) {
    try {
        context.log('JavaScript HTTP trigger function processed a request.');

        const parsedData = parse(req.rawBody);
    
        const message = parsedData && parsedData.message;
        const publicKey = parsedData && parsedData.publickey;
        const privateKey = parsedData && parsedData.privatekey;

        await sendNotification(context, message, publicKey, privateKey);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                message: message,
                publicKey: publicKey,
                privateKey: privateKey
            }
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: err
        };
    }
}