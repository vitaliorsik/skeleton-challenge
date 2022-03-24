import Product from '../models/product';
import {ELEMENT_ALREADY_EXIST} from '../constants/errors';
import {dynamoClient} from '../constants/aws';
import {DeleteItemOutput, GetItemOutput, PutItemOutput, ScanOutput} from 'aws-sdk/clients/dynamodb';
const TABLE_NAME = 'products';

export const getProducts = async (): Promise<ScanOutput> => {
    const params = {
        TableName: TABLE_NAME
    };
    return await dynamoClient.scan(params).promise();
}

export const getProductByName = async (name: string): Promise<GetItemOutput> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            name
        }
    }
    return await dynamoClient.get(params).promise();
}

export const addProduct = async (product: Product): Promise<PutItemOutput> => {
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

export const updateProduct = async (product: Product): Promise<PutItemOutput> => {
    const params = {
        TableName: TABLE_NAME,
        Item: product,
    }
    return await dynamoClient.put(params).promise();
}

export const deleteProduct = async (name: string): Promise<DeleteItemOutput> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            name
        }
    }
    return await dynamoClient.delete(params).promise();
}
