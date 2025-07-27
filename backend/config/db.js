// const mongoose = require('mongoose');
import mongoose from 'mongoose';

 const connectDB=async ()=>{

    try{
        const conn=await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected successfully")
    } catch(error){
        console.error(` db Error: ${error.message}`);
    }
}

// module.exports=connectDB;

export default connectDB;