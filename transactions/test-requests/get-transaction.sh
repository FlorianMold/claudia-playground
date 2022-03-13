# Get transactions for iban = 1234
curl https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production/transactions/1234

# Get transactions for a specified month
curl https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production/transactions/1234?month=03

# Get transactions for a specified year
curl https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production/transactions/1234?year=2022

# Get transaction for a specified month and year
curl https://dkxj452gl7.execute-api.eu-central-1.amazonaws.com/production/transactions/1234?year=2022&month=03
