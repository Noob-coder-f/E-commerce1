
import User from '../model/user.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import Userorder from '../model/userOrder.model.js';
import { adminSocket } from '../index.js';



export const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (password.length < 6) {
            // console.log("password must be at least 6 characters long");
            return res.status(200).json({ message: "password must be at least 6 characters long" })
        }
        

    
    const user = await User.findOne({ email })
    if (user) {
        console.log("User already exists");
        res.status(400).json({ message: "User already exists" });
    }
    else {
        const hashPassword = await bcrypt.hash(password, 10)
        const createUser = new User({
            name,
            email,
            password: hashPassword
        })

        await createUser.save()

        // Generate JWT token
        // Note: Ensure you have set JWT_SECRET and JWT_EXPIRES_IN in your .env file
        const token = jwt.sign({ id: createUser._id , role: createUser.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({ success: true, message: "user created succesfully.", token })
    }

} catch (error) {
    console.error('signup error', error.message);

}
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "user does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(500).json({ message: "invalid cardential" })
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id , role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({ success: true, message: "login successfull baackend", token, user: { id: user._id, name: user.name, email: user.email } })

    } catch (error) {
        console.error("login error", error)

    }
}

export const getUsers = async (req, res) => {
    try {

        const user = await User.find();
        res.status(200).json({ success: true, users: user })

    } catch (error) {
        console.error('user fetching error', error.message);
        res.status(500).json({ success: false, message: "internal server error" })

    }

}



// user order controller

export const placeOrder = async (req, res) => {
    try {
        const cartItems = req.body;
        const userId = req.user.id; // Get user ID from the authenticated token

        if(Array.isArray(cartItems) && cartItems.length===0){
            return res.status(400).json({ message: "Cart is empty" });
        }

        const user=await User.findById(userId).select('name email');
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        //fetching existing orders for the user

        let userorder=await Userorder.findOne({ userId: userId });

        if(!userorder){
            //if not exist create a new order
             userorder=new Userorder({
                userId,
                name:user.name,
                email:user.email,
                orders:cartItems
            })    
            
        } else{
            //is exist then push the new order items to existing orders
            userorder.orders.push(...cartItems);
        }   
        await userorder.save();
      
      // get io instance
    const io = req.app.get("io");

    // notify all admins in the "admins" room
    io.to("admins").emit("newOrder", {
      user: user.name,
      email: user.email,
      orders: cartItems, // Use cartItems here
    });
        
        res.status(201).json({ success: true, message: "Order placed successfully", order: userorder });   
        
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
        
    }

}

export const userOders=async(req,res)=>{

    try {
        const userId=req.user.id; // Get user ID from the authenticated token
        const userorder=await Userorder.find({userId})

        if(!userorder || userorder.length === 0){
            return res.status(404).json({ message: "No orders found for this user" });
        }
        res.status(200).json({ success: true, orders: userorder });


        
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
        
    }
}