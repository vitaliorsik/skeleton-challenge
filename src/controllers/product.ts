import Product from '../models/product';
import {INVALID_PRICE, PRODUCT_NOT_FOUNT, REQUIRED_INPUTS} from '../constants/errors';
import {dynamoClient} from '../constants/aws';
import {DeleteItemOutput, PutItemOutput, ScanOutput} from 'aws-sdk/clients/dynamodb';
import {isEmptyObject, isNumber} from '../utils';
import {Request, Response, NextFunction} from 'express';
const TABLE_NAME = 'products';

export const getProducts = async (): Promise<ScanOutput> => {
    const params = {
        TableName: TABLE_NAME
    };
    return await dynamoClient.scan(params).promise();
}

export const getProductById = async (id: string): Promise<Product> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id
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
    return await dynamoClient.put(params).promise();
}

export const updateProduct = async (product: Product): Promise<PutItemOutput> => {
    const params = {
        TableName: TABLE_NAME,
        Item: product,
    }
    return await dynamoClient.put(params).promise();
}

export const deleteProduct = async (id: string): Promise<DeleteItemOutput> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id
        }
    }
    return await dynamoClient.delete(params).promise();
}

export const checkProductValidity = async (req: Request, res: Response, next: NextFunction) => {
    const product: Product = req.body;
    if (!(product.name && product.price)) {
        return res.status(400).send(REQUIRED_INPUTS);
    }
    if (!isNumber(product.price)) {
        return res.status(400).send(INVALID_PRICE);
    }
    next();
}

export const checkProductExist = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        const existentProduct = await getProductById(id);
        if (!existentProduct) {
            return res.status(404).send(PRODUCT_NOT_FOUNT);
        }
        next();
    }
    catch (err) {
        next(err);
    }
}
