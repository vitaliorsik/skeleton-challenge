import Product from '../models/product';
import {ELEMENT_ALREADY_EXIST, INVALID_PRICE, PRODUCT_NOT_FOUNT, REQUIRED_INPUTS} from '../constants/errors';
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

export const checkProductValidity = async (req: Request, res: Response, next: NextFunction) => {
    const product: Product = req.body;
    if (req.params.name) {
        product.name = req.params.name;
    }
    if (!(product.name && product.price)) {
        return res.status(400).send(REQUIRED_INPUTS);
    }
    if (!isNumber(product.price)) {
        return res.status(400).send(INVALID_PRICE);
    }
    next();
}

export const checkProductExist = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.name;
    try {
        const existentProduct = await getProductByName(name);
        if (!existentProduct) {
            return res.status(404).send(PRODUCT_NOT_FOUNT);
        }
        next();
    }
    catch (err) {
        next(err);
    }
}
