import { razorpayInstance } from "../index.js";
import crypto from 'crypto';
import Userorder from '../model/userOrder.model.js';
import User from '../model/user.model.js';



export const paymentSuccess = async (req, res) => {
    const option = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    }

    const order = await razorpayInstance.orders.create(option);
    res.status(200).json({ success: true, order })
}

export const getKey = async (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
}

export const verifyPayment = async (req, res) => {

    try {
        // console.log('Verifying payment with data:', req.body);
        //in req.body we get razorpay_order_id,razorpay_payment_id,razorpay_signature
        // ALSO send userId, name, email, cartItems from frontend


        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, name, email, cartItems } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        // console.log('razorpay Signature:', razorpay_signature);
        // console.log('Expected Signature:', expectedSignature);

        const isAuthentic = expectedSignature === razorpay_signature;
        if (isAuthentic) {
            // Database comes here
            //  const cartItems = req.body;
            // const userId = req.user.id; // Get user ID from the authenticated token

            if (Array.isArray(cartItems) && cartItems.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }

            const user = await User.findById(userId).select('name email');
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            //fetching existing orders for the user

            let userorder = await Userorder.findOne({ userId: userId });

            if (!userorder) {
                //if not exist create a new order
                userorder = new Userorder({
                    userId,
                    name: user.name,
                    email: user.email,
                    orders: cartItems
                })

            } else {
                //is exist then push the new order items to existing orders
                userorder.orders.push(...cartItems);
            }
            await userorder.save();
            // console.log("Order saved successfully:", userorder);

            // get io instance
            const io = req.app.get("io");

            // notify all admins in the "admins" room
            io.to("admins").emit("newOrder", {
                user: user.name,
                email: user.email,
                orders: cartItems, // Use cartItems here
            });

            // res.status(201).json({ success: true, message: "Order placed successfully", order: userorder });  

            // return res.redirect(`${process.env.CLIENT_URL}/paymentSuccess?referenceId=${razorpay_payment_id}`)
            res.status(200).json({
                success: true,
                referenceId: razorpay_payment_id
            });


        } else {
            return res.status(400).json({ success: false, message: "Invalid signature sent!" })
        }

        // res.status(200).json({success:true,message:"payment verified successfully"})

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }
}