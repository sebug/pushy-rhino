const { TableServiceClient, AzureNamedKeyCredential, TableClient } = require("@azure/data-tables");

// insert the endpoint into azure tables - check whether this works
async function insertEndpoint(endpoint, context) {
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
    let entity = {
        partitionKey: "Prod",
        rowKey: endpoint,
        endpoint: endpoint,
        status: 'active'
    };
    await tableClient.upsertEntity(entity);
};

module.exports = async function (context, req) {
    context.log('Register push notification processed a request.');

    const endpoint = req.body && req.body.endpoint;

    if (!endpoint) {
        context.res = {
            status: 400,
            body: 'Have to provide an endpoint to register'
        };
        return;
    }


    insertEndpoint(endpoint, context).then(function () {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                endpoint: endpoint
            }
        };
    }, function (err) {
        context.res = {
            status: 500,
            body: '' + err
        };
    });
}