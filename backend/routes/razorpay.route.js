import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
console.log("Razorpay route loaded",process.env.RAZORPAY_KEY_ID);
// ✅ 1) Initialize Razorpay instance using keys from .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       // 👈 Your Test Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // 👈 Your Test Key Secret
});
console.log("Using Razorpay keys:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET ? "✅ Loaded" : "❌ Not loaded");


// ✅ 2) Route to create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // frontend will send amount in paise (100 = ₹1)

    const options = {
      amount: amount, // amount in paise
      currency: "INR",
      receipt: "order_rcptid_" + new Date().getTime(), // unique receipt ID
    };

    const order = await razorpay.orders.create(options);

    // Send order details to frontend
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error in create-order:", error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

// ✅ 3) Route to verify payment signature
router.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create expected signature using HMAC SHA256
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // ✅ Signature valid → Payment Success
      return res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed!" });
    }
  } catch (error) {
    console.error("Error in verify-payment:", error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

export default router;
