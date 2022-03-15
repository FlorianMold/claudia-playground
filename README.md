# Bank98

This project contains three aws lambda-functions.

- customers
- monthly-report
- transactions

All of the lambda-functions and dynamoDB-tables are created in the `eu-central-1`-region.

## Functionality

All of these functions have an api-gateway. `customers` and `transaction` offers a GET and POST endpoint.
`monthly-report` only supports GET requests.

`customers` and `transactions` have a persistent dynamoDB storage.

## Testing

Each of the projects contains a folder called `test-requests`, where scripts to test the api's reside.

For example:

```bash
./test-requests/get-customer.sh

# {"customerName":"Florian","customerAddress":"Vienna","customerIban":"1234"}
```

### Customers

The customer lambda offers three endpoints.

#### GET /customers

Receives all customers.

Example:

```bash
curl https://3f9r4wfb01.execute-api.eu-central-1.amazonaws.com/production/customers
```

```json
[
  {
    "customerName": "Florian",
    "customerAddress": "Vienna",
    "customerIban": "1234"
  },
  {
    "customerName": "Florian",
    "customerAddress": "Vienna",
    "customerIban": "2345"
  }
]
```

#### GET /customers/{iban}

Receives the customer with the given iban. The iban is unique to the customer.

```bash
curl https://3f9r4wfb01.execute-api.eu-central-1.amazonaws.com/production/customers/1234
```

```json
{
  "customerName": "Florian",
  "customerAddress": "Vienna",
  "customerIban": "1234"
}
```

#### POST /customers

Creates a customer with the given information.

```bash
curl -H "Content-Type: application/json" -X POST \
-d '{"name":"Florian", "address": "Vienna", "iban": "2345"}' \
https://3f9r4wfb01.execute-api.eu-central-1.amazonaws.com/production/customers
```

### Transactions

The customer lambda offers two endpoints.

#### GET /transactions/{iban}

Receives the transactions with the given debtors iban. A `month` and `year` can be used as optional query-parameters for
the request to filter the transactions.

```bash
# Receives all transactions for the iban 1234
curl https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production/transactions/1234
```

```json
[
  {
    "transactionAmount": "132.50",
    "transactionDescription": "wage",
    "transactionDate": "2022-03-03",
    "transactionCreditorIban": "2345",
    "transactionDebtorIban": "1234",
    "transactionId": "2"
  },
  {
    "transactionAmount": "132.50",
    "transactionDescription": "wage",
    "transactionDate": "2022-03-03",
    "transactionCreditorIban": "1234",
    "transactionDebtorIban": "1234",
    "transactionId": "1"
  },
  {
    "transactionAmount": "132.50",
    "transactionDescription": "wage",
    "transactionDate": "2021-03-03",
    "transactionCreditorIban": "1234",
    "transactionDebtorIban": "1234",
    "transactionId": "3"
  }
]
```

```bash
# Receives all transactions for a specified month and year
curl https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production/transactions/1234?year=2021&month=03
```

```json
[
  {
    "transactionAmount": "132.50",
    "transactionDescription": "wage",
    "transactionDate": "2021-03-03",
    "transactionCreditorIban": "1234",
    "transactionDebtorIban": "1234",
    "transactionId": "3"
  }
]
```

#### POST /transactions

Creates a transaction with the given information.

```bash
curl -H "Content-Type: application/json" -X POST \
-d '{"id": "99", "debtorIban":"1234", "creditorIban":"2345", "date": "2022-03-03", "amount": "132.50", "description": "wage"}' \
https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production/transactions

```

### Monthly-report

The monthly-report lambda offers one endpoint.

#### GET /monthly-report/{iban}

Receives the monthly-report with the given debtors iban. A `month` and `year` can be used as optional query-parameters
for the request, to filter the monthly-reports.

```bash
# Receives the monthly-report for a specified month and year
curl https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production/transactions/1234?year=2021&month=03
```

```json
{
  "report": {
    "customer": {
      "customerName": "Florian",
      "customerAddress": "Vienna",
      "customerIban": "1234"
    },
    "transactions": [
      {
        "transactionAmount": "132.50",
        "transactionDescription": "wage",
        "transactionDate": "2021-03-03",
        "transactionCreditorIban": "1234",
        "transactionDebtorIban": "1234",
        "transactionId": "3"
      }
    ]
  }
}
```

## Database

The service uses a dynamoDB with two tables. The tables are `customers` and `transactions`. The customer lambda
creates `customers`-table and the transactions-lambda creates the `transactions`-lambda. The scripts for creating the
table are stored the folder of the lambda. `customers/create-customer-db.sh` creates the `customers`-table and
`transactions/create-transaction-db.sh` creates the `transactions`-table.

## Getting started

Run `yarn install` in the `customers`, `monthly-report` and `transactions` folder and the project is ready to be
deployed to AWS.

Every `package.json` has the same three scripts:

- **deploy-aws**: Creates the function on AWS
- **update-aws**: Updates the code of the function on AWS
- **release-aws**: Sets the latest version on AWS to deploy.
