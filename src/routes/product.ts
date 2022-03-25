import express from 'express';
import {
    addProduct,
    checkProductExist,
    checkProductValidity,
    deleteProduct,
    getProductByName,
    getProducts,
    updateProduct
} from '../controllers/product';
import Product from '../models/product';
import {
    ELEMENT_ALREADY_EXIST,
    PRODUCT_NOT_FOUNT,
    UNKNOWN_ERROR
} from '../constants/errors';

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

productRouter.post('/', checkProductValidity, async (req, res) => {
    const product: Product = req.body;
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

productRouter.put('/:name', checkProductValidity, checkProductExist, async (req, res) => {
    const product: Product = req.body;
    product.name = req.params.name;
    try {
        await updateProduct(product);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

productRouter.delete('/:name', checkProductExist, async (req, res) => {
    const name = req.params.name;
    try {
        await deleteProduct(name);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).send(UNKNOWN_ERROR);
    }
})

export default productRouter;
