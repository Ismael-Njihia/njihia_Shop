import Order from './models/orderModel.js'

async function deleteOrders(){
    try{
       await Order.deleteMany();
       console.log("Deleted")


    }catch(error){
        console.error(error)
    }


}
deleteOrders()