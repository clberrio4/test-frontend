aws cloudformation create-stack `
  --stack-name frontent-test `
  --template-body file://template.yml `
  --parameters file://config.json `
  --capabilities CAPABILITY_NAMED_IAM `
  --region us-east-1