import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

//create New order
//route post/api/products
//access private
const addOrderItems = asyncHandler(async(req,res)=>{
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body
    if(orderItems && orderItems.length === 0){
        res.status(400)
        throw new Error('No order items')
       
    }else{
        const order = new Order({
            orderItems: orderItems.map((item)=>({
                ...item,
                product: item._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder)

    }
});


//Get logged in User
//route get/api/orders/myorders
//access private
const getMyOrders = asyncHandler(async(req,res)=>{
    const orders = await Order.find({user: req.user._id});
    res.json(orders)
});

//Get Order by ID
//route GET/api/orders/:id
//access private
const getOrderById = asyncHandler(async (req,res)=>{
   const order = await Order.findById(req.params.id).populate('user','name email');
    
   if(order){
        res.json(order)
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
});

//Update Order to paid
//route PUT/api/orders/:id/pay
//access private
const updateOrderToPaid = asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id);
    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id:req.body.id,
            status:req.body.status,
            update_time:req.body.update_time,
            email_address:req.body.email_address
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder)
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
});


//Update  to delivered
//route PUT/api/orders/:id/deliver
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