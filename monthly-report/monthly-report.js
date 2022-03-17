const ApiBuilder = require('claudia-api-builder');
const apigClientFactory = require('aws-api-gateway-client').default;
const AWS = require('aws-sdk');

// Get the urls from environment variables.
const transactionInvokeUrl = () => process.env.TRANSACTION_URL || 'https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production';
const customerInvokeUrl = () => process.env.CUSTOMER_URL || 'https://3f9r4wfb01.execute-api.eu-central-1.amazonaws.com/production';

const transactionConfig = {invokeUrl: transactionInvokeUrl()};
const transactionClient = apigClientFactory.newClient(transactionConfig);

const customerConfig = {invokeUrl: customerInvokeUrl()};
const customerClient = apigClientFactory.newClient(customerConfig);

const api = new ApiBuilder();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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

/**
 * Monthly reports that directly targets the db instead of requesting the other services.
 * Is this a better solution?
 */
api.get('/monthly-report-db/{iban}', (request) => {
    const month = request.queryString.month || '';
    const year = request.queryString.year || '';

    const yearScanQu = year ? `${year}` : ``;
    // Use this pattern, otherwise a day can also be found
    const monthScanQu = month ? `-${month}-` : ``;
    const monthQueryString = yearScanQu + monthScanQu;

    const transactionDbQuery = {
        TableName: 'transactions',
        FilterExpression: 'transactionDebtorIban = :iban and contains(transactionDate, :monthYear)',
        ExpressionAttributeValues: {
            ":iban": request.pathParams.iban,
            ":monthYear": monthQueryString
        }
    }

    const promise1 = dynamoDb.scan(transactionDbQuery).promise()
        .then(response => response.Items)

    const customerDbQuery = {
        TableName: 'customers',
        Key: {
            customerIban: request.pathParams.iban
        }
    }

    const promise2 = dynamoDb.get(customerDbQuery).promise()
        .then(response => response.Item)

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
