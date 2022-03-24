import {config} from '../constants/config';
import Product from '../models/product';
import {ELEMENT_ALREADY_EXIST} from "../constants/errors";

const AWS = require('aws-sdk');

AWS.config.update({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
});

const dynamoClient = new AWS
    .DynamoDB.DocumentClient();
const TABLE_NAME = 'products';

export const getProducts = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    const products = await dynamoClient.scan(params).promise();
    return products;
}

export const getProductByName = async (name: string) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            name
        }
    }
    return await dynamoClient.get(params).promise();
}

export const addProduct = async (product: Product) => {
    const params = {
        TableName: TABLE_NAME,
        Item: product,
    }
    const existentProduct = await getProductByName(product.name);
    if (existentProduct) {
        throw new Error(ELEMENT_ALREADY_EXIST);
    }
    return await dynamoClient.put(params).promise();
}

export const updateProduct = async (product: Product) => {
    const params = {
        TableName: TABLE_NAME,
        Item: product,
    }
    return await dynamoClient.put(params).promise();
}

export const deleteProduct = async (name: string) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            name
        }
    }
    return await dynamoClient.delete(params).promise();
}
