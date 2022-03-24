import {config} from './config';

const AWS = require('aws-sdk');

AWS.config.update({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
});

export const dynamoClient = new AWS
    .DynamoDB.DocumentClient();
