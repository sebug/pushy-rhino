import { parse } from 'qs';

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const parsedData = parse(req.rawBody);

    const message = parsedData && parsedData.message;
    const responseMessage = message
        ? ("Received message " + message)
        : "This HTTP triggered function executed successfully. Pass a message in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}