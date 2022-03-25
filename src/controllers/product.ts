import Product from '../models/product';
import {ELEMENT_ALREADY_EXIST} from '../constants/errors';
import {dynamoClient} from '../constants/aws';
import {DeleteItemOutput, PutItemOutput, ScanOutput} from 'aws-sdk/clients/dynamodb';
import {isEmptyObject} from '../utils';
const TABLE_NAME = 'products';

export const getProducts = async (): Promise<ScanOutput> => {
    const params = {
        TableName: TABLE_NAME
    };
    return await dynamoClient.scan(params).promise();
}

export const getProductByName = async (name: string): Promise<Product> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            name
        }
    }
    const productResult = await dynamoClient.get(params).promise();
    return isEmptyObject(productResult) ? null : productResult.Item;
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
