import express from 'express';
 const router = express.Router();
 import {getProducts, getProductById,
     createProduct, updateProduct,
    deleteProduct } from '../controllers/productController.js'
 import {protect, admin} from '../middleware/authMiddleware.js'

router.route('/').get(getProducts);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);;
router.route('/').post(protect, admin, createProduct)


 export default router;