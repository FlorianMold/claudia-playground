const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');

const api = new ApiBuilder();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TableName = 'transactions';

api.post('/transactions', (request) => {
    const {id, debtorIban, creditorIban, date, amount, description} = request.body;

    const params = {
        TableName,
        Item: {
            transactionId: id,
            transactionDebtorIban: debtorIban,
            transactionCreditorIban: creditorIban,
            transactionDate: date,
            transactionAmount: amount,
            transactionDescription: description
        }
    }
    return dynamoDb.put(params).promise()
}, {success: 201});

api.get('/transactions/{iban}', (request) => {
    const month = request.queryString.month || null;
    const year = request.queryString.year || null;

    const yearScanQu = year ? `${year}` : ``;
    // Use this pattern, otherwise a day can also be found
    const monthScanQu = month ? `-${month}-` : ``;
    const monthQueryString = yearScanQu + monthScanQu;

    const params = {
        TableName,
        FilterExpression: 'transactionDebtorIban = :iban and contains(transactionDate, :monthYear)',
        ExpressionAttributeValues: {
            ":iban": request.pathParams.iban,
            ":monthYear": monthQueryString
        }
    }

    return dynamoDb.scan(params).promise()
        .then(response => response.Items)
});

module.exports = api;
