import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import product from './data/products.js';
import products from './data/products.js';

const port = process.env.PORT || 8000;

const app = express();

app.get('/', (req, res) => {
    res.send("API is running")
})

app.get('/api/products', (req, res) => {
    res.json(product)
    
})

app.get('/api/products/:id', (req, res)=>{
    const product = products.find((p)=> p._id === req.params.id);
    res.json(product)
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})