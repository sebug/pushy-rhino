const { TableServiceClient, AzureNamedKeyCredential, TableClient } = require("@azure/data-tables");

// insert the endpoint into azure tables - check whether this works
async function insertEndpoint(endpoint, context, authKey, p256dh) {
    try {
        const account = process.env.TABLES_STORAGE_ACCOUNT_NAME;
        const accountKey = process.env.TABLES_PRIMARY_STORAGE_ACCOUNT_KEY;
        const suffix = process.env.TABLES_STORAGE_ENDPOINT_SUFFIX;
    
        const url = 'https://' + account + '.table.' + suffix;
    
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
        const rowKey = endpoint.replace(/\//g, '_')
        .replace(/\?/g, '_');

        let entity = {
            partitionKey: "Prod",
            rowKey: rowKey,
            endpoint: endpoint,
            status: 'active',
            authKey: authKey,
            p256dh: p256dh
        };
        await tableClient.upsertEntity(entity);
    } catch (err) {
        context.log(err);
        throw err;
    }
};

module.exports = async function (context, req) {
    context.log('Register push notification processed a request.');

    const endpoint = req.body && req.body.endpoint;
    const authKey = req.body && req.body.keys && req.body.keys.auth;
    const p256dh = req.body && req.body.keys && req.body.keys.p256dh;

    if (!endpoint) {
        context.res = {
            status: 400,
            body: 'Have to provide an endpoint to register'
        };
        return;
    }

    try {
        const insertEndpointResult = await insertEndpoint(endpoint, context, authKey, p256dh);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                endpoint: endpoint,
                authKey: authKey,
                p256dh: p256dh
            }
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: err
        };
    }
}