# Get monthly-report for iban = 1234
curl https://qbaesz83wd.execute-api.eu-central-1.amazonaws.com/production/monthly-report/1234

# Get monthly-report for a specified month
curl https://qbaesz83wd.execute-api.eu-central-1.amazonaws.com/production/monthly-report/1234?month=03

# Get monthly-report for a specified year
curl https://qbaesz83wd.execute-api.eu-central-1.amazonaws.com/production/monthly-report/1234?year=2022

# Get monthly-report for a specified month and year
curl https://qbaesz83wd.execute-api.eu-central-1.amazonaws.com/production/monthly-report/1234?year=2022&month=03
