import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    cardname:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    cardimage:{
        type:String,
        required:true
    },
    qty:{
        type:Number,
        required:true
    }

})
const Order=mongoose.model('Order',orderSchema);
export default Order;