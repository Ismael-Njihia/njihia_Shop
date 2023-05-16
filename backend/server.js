import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';



const port = process.env.PORT || 8000;
connectDB();
const app = express();
import productRoutes from './routes/productRoutes.js';

app.get('/', (req, res) => {
    res.send("API is running")
})

app.use('/api/products', productRoutes);
app.use(notFound);
app.use(errorHandler);



app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})