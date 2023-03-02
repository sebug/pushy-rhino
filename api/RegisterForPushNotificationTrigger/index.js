const AzureTables = require("@azure/data-tables");

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

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: 'Registered endpoint ' + endpoint + ' store in ' + process.env.TABLES_STORAGE_ENDPOINT_SUFFIX
    };
}