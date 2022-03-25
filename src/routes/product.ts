import express from 'express';
import {
    addProduct,
    deleteProduct,
    getProductByName,
    getProducts,
    updateProduct
} from '../controllers/product';
import Product from '../models/product';
import {
    ELEMENT_ALREADY_EXIST,
    INVALID_PRICE,
    PRODUCT_NOT_FOUNT,
    REQUIRED_INPUTS,
    UNKNOWN_ERROR
} from '../constants/errors';
import {isNumber} from '../utils';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    try {
        const characters = await getProducts();
        res.json(characters);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

productRouter.get('/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const product = await getProductByName(name);
        if (!product) {
            return res.status(404).send(PRODUCT_NOT_FOUNT);
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

productRouter.post('/', async (req, res) => {
    const product: Product = req.body;
    if (!(product.name && product.price)) {
        return res.status(400).send(REQUIRED_INPUTS);
    }
    if (!isNumber(product.price)) {
        return res.status(400).send(INVALID_PRICE);
    }
    try {
        const newProduct = await addProduct(product);
        res.json(newProduct);
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === ELEMENT_ALREADY_EXIST) {
            return res.status(400).send(ELEMENT_ALREADY_EXIST);
        }
        res.status(500).send(UNKNOWN_ERROR);
    }
})

productRouter.put('/:name', async (req, res) => {
    const product: Product = req.body;
    product.name = req.params.name;
    if (!(product.name && product.price)) {
        return res.status(400).send(REQUIRED_INPUTS);
    }
    if (!isNumber(product.price)) {
        return res.status(400).send(INVALID_PRICE);
    }
    try {
        const existentProduct = await getProductByName(product.name);
        if (!existentProduct) {
            return res.status(404).send(PRODUCT_NOT_FOUNT);
        }
        const updatedProduct = await updateProduct(product);
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

productRouter.delete('/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const existentProduct = await getProductByName(name);
        if (!existentProduct) {
            return res.status(404).send(PRODUCT_NOT_FOUNT);
        }
        const deletedCharacter = await deleteProduct(name);
        res.json(deletedCharacter);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

export default productRouter;
