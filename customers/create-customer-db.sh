# Creates the database for the customers on aws
# Install the cli first https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

aws dynamodb create-table --table-name customers \
  --attribute-definitions AttributeName=customerIban,AttributeType=S \
  --key-schema AttributeName=customerIban,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --region eu-central-1 \
  --query TableDescription.TableArn --output text
