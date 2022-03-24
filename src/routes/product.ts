import express from "express";
import {
    addProduct,
    deleteProduct,
    getProductByName,
    getProducts,
    updateProduct
} from "../controllers/dynamoDB";
import Product from "../models/product";
import {ELEMENT_ALREADY_EXIST} from "../constants/errors";

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    try {
        const characters = await getProducts();
        res.json(characters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Something went wrong' });
    }
})

productRouter.get('/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const character = await getProductByName(name);
        res.json(character);
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Something went wrong' });
    }
})

productRouter.post('/', async (req, res) => {
    const product = req.body;
    try {
        const newProduct = await addProduct(product);
        res.json(newProduct);
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === ELEMENT_ALREADY_EXIST) {
            return res.status(500).json({ err: ELEMENT_ALREADY_EXIST });
        }
        res.status(500).json({ err: 'Something went wrong' });
    }
})

productRouter.put('/:name', async (req, res) => {
    const product: Product = req.body;
    product.name = req.params.name;
    try {
        const updatedCharacter = await updateProduct(product);
        res.json(updatedCharacter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Something went wrong' });
    }
})

productRouter.delete('/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const deletedCharacter = await deleteProduct(name);
        res.json(deletedCharacter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Something went wrong' });
    }
})

export default productRouter;
