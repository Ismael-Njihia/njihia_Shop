import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

//create New order
//route post/api/products
//access private
const addOrderItems = asyncHandler(async(req,res)=>{
    res.send('order created')
});


//Get logged in User
//route get/api/orders/myorders
//access private
const getMyOrders = asyncHandler(async(req,res)=>{
    res.send('getMyOrders')
});

//Get Order by ID
//route GET/api/orders/:id
//access private
const getOrderById = asyncHandler(async(req,res)=>{
    res.send('getOrderById')
});

//Update Order to paid
//route GET/api/orders/:id/pay
//access private
const updateOrderToPaid = asyncHandler(async(req,res)=>{
    res.send('updateOrderToPaid')
});


//Update  to delivered
//route GET/api/orders/:id/deliver
//access private/admin
const updateOrderToDelivered = asyncHandler(async(req,res)=>{
    res.send('updateOrderToDelivered')
});

//Get all orders
//route GET/api/orders
//access private/admin
const getOrders = asyncHandler(async(req,res)=>{
    res.send('getOrders')
});

export{
    getMyOrders,
    getOrderById,
    addOrderItems,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
}