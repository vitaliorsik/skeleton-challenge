import express from 'express';
import productRouter from './routes/product';
import userRouter from './routes/user';
import { verifyToken } from './controllers/auth';
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/api/products', verifyToken, productRouter);
app.use('/api/auth', userRouter);

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
