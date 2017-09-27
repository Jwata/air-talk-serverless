// import https from 'https';
import crypto from 'crypto';
import AWS from 'aws-sdk';
import {} from 'dotenv/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_DYNAMO_ENDPOINT,
});

export const index = (event, context, callback) => {
  const params = { TableName: 'Image' };
  dynamoDb.scan(params, (error, data) => {
    const response = (!error)
      ? { statusCode: 200, body: JSON.stringify({ images: data.Items }) }
      : { statusCode: 400, body: JSON.stringify({ error: error.text }) };
    callback(error, response);
  });
};

export const create = (event, context, callback) => {
  const url = event.url;
  const id = crypto.randomBytes(16).toString('hex');
  const params = {
    TableName: 'Image',
    Item: { id: id, url: url }
  };
  dynamoDb.put(params, (error) => {
    const response = (!error)
      ? { statusCode: 200 }
      : { statusCode: 400, body: JSON.stringify({ error: error.text }) };
    callback(error, response);
  });
};

export const remove = (event, context, callback) => {
  const id = event.id;
  const params = {
    TableName: 'Image',
    Key: { id: id }
  };
  dynamoDb.delete(params, (error) => {
    const response = (!error)
      ? { statusCode: 200 }
      : { statusCode: 400, body: JSON.stringify({ error: error.text }) };
    callback(error, response);
  });
};
