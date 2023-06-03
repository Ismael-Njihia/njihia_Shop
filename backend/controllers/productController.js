
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//fetch all the products
//route GET/api/products
//access public
const getProducts = asyncHandler(async(req,res)=>{
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {
        name:{$regex: req.query.keyword, $options: 'i'}
    }:{

    }
    const count = await Product.countDocuments({...keyword});



    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize *(page - 1))
    res.json({products, page, pages: Math.ceil(count/pageSize)})
});


//getAspecificPoduct
//route GET/api/products/:id
//access public
const getProductById = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);

 if(product){
        res.json(product)
 }
    else{
        res.status(404)
        throw new Error('Product not found')
    }
});
//create Product
// POST /api/products
//private/admin
const createProduct = asyncHandler(async(req,res)=>{
    const product = new Product({
        name:'Sample name',
        price:0,
        user:req.user._id,
        image:'/images/sample.jpg',
        brand:'Sample brand',
        category:'Sample category',
        countInStock:0,
        numReviews:0,
        description:'Sample description'

    })
    const createdProduct = await product.save();
    res.status(201).json(createdProduct)

})

//update Product
// PUT /api/products/:id
//private/admin
const updateProduct = asyncHandler(async(req,res)=>{
    const {name, price, description, image, brand, category, countInStock} = req.body;
    const product = await Product.findById(req.params.id);
    if(product){ 
        product.name= name;
        product.price= price;
        product.description= description;
        product.image= image;
        product.brand= brand;
        product.category= category;
        product.countInStock= countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct)


    }else{
        res.status(404)
        throw new Error('Product not found')
    }



})


    //delete Product
// delete /api/products/:id
//private/admin
const deleteProduct = asyncHandler(async(req,res)=>{
    
    const product = await Product.findById(req.params.id);

    if(product){ 
        await Product.deleteOne({_id: product._id});
        res.status(200).json({message: 'Product deleted successfully'})

    }else{
        res.status(404)
        throw new Error('Product not found')
    }

    

})
//Create a new review
//POST /api/products/:id/reviews
//private
const createProductReview = asyncHandler(async(req,res)=>{
    const {rating, comment} = req.body;
    const product = await Product.findById(req.params.id);

    if(product){
       const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
       ) 

       if(alreadyReviewed){
        res.status(400)
        throw new Error('Product already reviewed')
       }
       const review ={

        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
       };

         product.reviews.push(review);
         product.numReviews = product.reviews.length;

         product.rating = product.reviews.reduce((acc, review)=> acc + review.rating, 0)/ product.reviews.length;

        await product.save();
        res.status(201).json({message: 'Review added'}) 
    }else{
        res.status(404);
        throw new Error('Product not found')
    }


})

//getTopRated Products
//route GET/api/products/top
//access public
const getTopProducts = asyncHandler(async(req,res)=>{
    const products = await Product.find({}).sort({rating: -1}).limit(3);
 try{
    if(!products){
        return res.status(404).json({error: 'No Products Found'});

    }
    res.json(products);
}catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal server error.'})
}

});


export  {getProducts, 
    
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    getTopProducts,
    
    
    createProductReview
}
