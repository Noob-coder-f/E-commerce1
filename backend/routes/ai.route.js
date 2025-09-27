// import express from "express";
// import OpenAI from "openai";
// import mongoose from "mongoose";
// // import Product from "../models/product.model.js"; // <-- make sure you have a Product model
// import Userorder from "../model/userOrder.model.js";
// import Card from "../config/addCard.js";
// import dotenv from "dotenv";
// dotenv.config();

// const router = express.Router();

// // Initialize OpenAI client with your API key from .env
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // secret stays on backend!
// });

// // POST /api/ai/chat
// router.post("/ai/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     // Step 1: Ask OpenAI to respond in a shopping-assistant style
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // cost-effective chat model
//       messages: [
//         { role: "system", content: "You are a helpful shopping assistant for an e-commerce website." },
//         { role: "user", content: message },
//       ],
//     });

//     const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a reply.";

//     // Step 2: Search your product database (very basic example)
//     // Example: if user types "shoes", we find products with 'shoes' in name
//     let products = [];
//     try {
//       const regex = new RegExp(message, "i"); // case-insensitive search
//       products = await Card.find({ name: regex }).limit(5).lean();
//     } catch (dbErr) {
//       console.error("Product search failed:", dbErr.message);
//     }

//     res.json({ reply, products });
//   } catch (err) {
//     console.error("AI route error:", err.message);
//     res.status(500).json({ error: "Failed to get AI response" });
//   }
// });

// export default router;




// backend/routes/ai.route.js
// ROUTE = connects a URL path to a controller function.
// This route defines POST /api/ai/chat which the frontend will call.


import express from "express";
import { chatWithAI } from "../controllers/ai.controller.js";


const router = express.Router();


// We intentionally do NOT force auth here to keep the first version simple.
// If you want only logged-in users to use AI, import your authenticateToken middleware and add it.
// import { authenticateToken } from "../middleware/auth.middleware.js";
// router.post("/ai/chat", authenticateToken, chatWithAI);


router.post("/ai/chat", chatWithAI);


export default router;