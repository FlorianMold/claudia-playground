const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');

const api = new ApiBuilder();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TableName = 'customers';

api.post('/customers', (request) => {
    const {name, address, iban} = request.body;

    const params = {
        TableName,
        Item: {
            customerName: name,
            customerAddress: address,
            customerIban: iban
        }
    };
    return dynamoDb.put(params).promise();
}, {success: 201});

api.get('/customers/{iban}', (request) => {
    const params = {
        TableName,
        Key: {
            customerIban: request.pathParams.iban
        }
    }

    return dynamoDb.get(params).promise()
        .then(response => response.Item)
});

api.get('/customers', () => {
    return dynamoDb.scan({TableName}).promise()
        .then(response => response.Items)
});

module.exports = api;

