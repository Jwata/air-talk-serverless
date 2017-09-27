// import https from 'https';
import AWS from 'aws-sdk';
import {} from 'dotenv/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_DYNAMO_ENDPOINT,
});

export const index = (event, context, callback) => {
  const params = { TableName: 'Image' };
  dynamoDb.scan(params, (_error, data) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        images: data.Items,
      }),
    };
    callback(null, response);
  });
};
