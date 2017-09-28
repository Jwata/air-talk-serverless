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
    const headers =   {
      'Access-Control-Allow-Origin': '*'
    };
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ images: data.Items })
    };
    callback(error, response);
  });
};

export const create = (event, context, callback) => {
  const body = JSON.parse(event.body);
  const id = crypto.randomBytes(16).toString('hex');
  const url = body.url;
  const image = { id: id, url: url };
  const params = {
    TableName: 'Image',
    Item: image
  }
  dynamoDb.put(params, (error) => {
    const headers =   {
      'Access-Control-Allow-Origin': '*'
    };
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(image)
    };
    callback(error, response);
  });
};

export const remove = (event, context, callback) => {
  const body = JSON.parse(event.body);
  const id= body.id;
  const params = {
    TableName: 'Image',
    Key: { id: id }
  };
  dynamoDb.delete(params, (error) => {
    const headers =   {
      'Access-Control-Allow-Origin': '*'
    };
    const response = {
      statusCode: 200,
      headers: headers
    };
    callback(error, response);
  });
};
