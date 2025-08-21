import mongoose from "mongoose";

const orderItemSchema=new mongoose.Schema({
    cardname: {
        type: String,
        required: true
    },
    price: {        
        type: Number,
        required: true
    },
    cardimage: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    }

},{id:false ,  timestamps: true });  //it  stop db to not create _id field 

const userOrderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    orders: [orderItemSchema], // Array of order items
});
    
const Userorder=mongoose.model('Userorder', userOrderSchema);
export default Userorder;
    