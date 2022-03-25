import express from 'express';
import {
    addProduct,
    checkProductExist,
    checkProductValidity,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct
} from '../controllers/product';
import Product from '../models/product';
import {
    ELEMENT_ALREADY_EXIST,
    PRODUCT_NOT_FOUNT,
    UNKNOWN_ERROR
} from '../constants/errors';
import {generateRandomString} from "../utils";

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

productRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await getProductById(id);
        if (!product) {
            return res.status(404).send(PRODUCT_NOT_FOUNT);
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

productRouter.post('/', checkProductValidity, async (req, res) => {
    const product: Product = req.body;
    product.id = generateRandomString(8);
    try {
        await addProduct(product);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === ELEMENT_ALREADY_EXIST) {
            return res.status(400).send(ELEMENT_ALREADY_EXIST);
        }
        res.status(500).send(UNKNOWN_ERROR);
    }
})

productRouter.put('/:id', checkProductValidity, checkProductExist, async (req, res) => {
    const product: Product = req.body;
    product.id = req.params.id;
    try {
        await updateProduct(product);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

productRouter.delete('/:id', checkProductExist, async (req, res) => {
    const id = req.params.id;
    try {
        await deleteProduct(id);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

export default productRouter;
