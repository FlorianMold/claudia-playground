const ApiBuilder = require('claudia-api-builder');
const apigClientFactory = require('aws-api-gateway-client').default;

// Get the urls from environment variables.
const transactionInvokeUrl = () => process.env.TRANSACTION_URL || 'https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production';
const customerInvokeUrl = () => process.env.CUSTOMER_URL || 'https://3f9r4wfb01.execute-api.eu-central-1.amazonaws.com/production';

const transactionConfig = {invokeUrl: transactionInvokeUrl()};
const transactionClient = apigClientFactory.newClient(transactionConfig);

const customerConfig = {invokeUrl: customerInvokeUrl()};
const customerClient = apigClientFactory.newClient(customerConfig);

const api = new ApiBuilder();

api.get('/monthly-report/{iban}', (request) => {
    const month = request.queryString.month || '';
    const year = request.queryString.year || '';

    const promise1 = transactionClient.invokeApi(
        {iban: 1234},
        `/transactions/{iban}?month=${month}&year=${year}`,
        'GET'
    )
    const promise2 = customerClient.invokeApi(
        {iban: 1234},
        '/customers/{iban}',
        'GET'
    );
    return Promise.all([promise1, promise2]).then(data => {
        const dataFromTransactionPromise = data[0].data;
        const dataFromCustomerPromise = data[1].data;

        return {
            report: {
                customer: {
                    ...dataFromCustomerPromise
                },
                transactions: [
                    ...dataFromTransactionPromise
                ]
            }
        }
    })
});

module.exports = api;
