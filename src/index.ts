import express from 'express';
import productRouter from "./routes/product";
const app = express();
const port = 8080;

app.use(express.json());
app.use('/', productRouter);

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
