// Below are the **exact files** to add/update for your MERN e‑commerce project to implement **AI Chat Assistant (Text + Card suggestions)**. I’ve added detailed comments explaining every line and why it exists.

// ---

// ## 1) `backend/controllers/ai.controller.js`

// > Purpose: Handle the chat request, search your `Card` collection for matching items, call OpenAI to craft a friendly reply **grounded** in the found products, and return both the reply and products to the frontend.

// ```js
// backend/controllers/ai.controller.js
// CONTROLLER = business logic holder used by Express route.
// This file defines a function `chatWithAI` that:
// 1) reads the user's message from req.body.message
// 2) searches MongoDB (your Card collection) for relevant items
// 3) calls OpenAI to generate a helpful, safe response
// 4) returns { reply, products } to the client

import OpenAI from "openai"; // OpenAI SDK to call chat models
import Card from '../config/addCard.js'  ; // <-- adjust the path if your file is elsewhere
import dotenv from "dotenv";
dotenv.config();
// NOTE: You said your model file is named addCard.js and exports `Card`.
// If your path is e.g. ../models/addCard.js then update accordingly.

// Create an OpenAI client using the secret API key from your .env (server-side only!)
// console.log("API KEY:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Not Found");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // ensure this is set in your .env file
});

// Helper function to clean user query
const cleanQuery = (message) => {
  return message
    .toLowerCase()
    .replace(/show me|find|please|i want|do you have|list|give me/gi, "") // remove common phrases
    .trim();
};

// Helper: attempt to extract a max budget (number) from a free-form message.
// e.g. "red t-shirt under 500" => returns 500. If nothing sensible is found, returns null.
function extractBudgetFromMessage(message) {
  try {
    // Grab all numbers from the message, pick the last one as a naive "budget".
    const nums = (message.match(/\d+/g) || []).map((n) => parseInt(n, 10)).filter(Boolean);
    if (!nums.length) return null;
    // Heuristic: if user said multiple numbers (e.g., size 42 under 1500), assume the largest is budget.
    return Math.max(...nums);
  } catch {
    return null;
  }
}

// Helper: create a short, compact list of products for the AI to reference.
// We "ground" the model to avoid it making up products that don't exist in your DB.
function makeProductContext(products) {
  if (!products?.length) return "(no matching products found)";
  // Keep it compact: name | price | url (if exists)
  const lines = products.map((p, i) => `${i + 1}. ${p.cardname} | ₹${p.price} | ${p.cardimage || "(no image)"}`);
  return lines.join("\n");
}

export const chatWithAI = async (req, res) => {
  try {
    // 1) Read user message from request body. The frontend sends { message: "..." }
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

     // 1️⃣ Clean the message to extract product keywords
    const clearQuery = cleanQuery(message);

    // 2) Build a MongoDB query to find relevant cards based on the message.
    //    - We try name matching with a case-insensitive regex.
    //    - If a budget is mentioned, we also filter by price <= budget.
    // const regex = new RegExp(message, "i");
    const regex = new RegExp(clearQuery, "i");
    const budget = extractBudgetFromMessage(message);

    const query = { cardname: regex };
    if (budget) {
      // only add price filter if budget is reasonable (avoid filtering on tiny numbers like sizes)
      if (budget >= 100) {
        query.price = { $lte: budget };
      }
    }

    // 3) Query MongoDB for matching products. Limit to a small number to keep UI + prompt compact.
    const cards = await Card.find(query).limit(6).lean();

    // 4) Prepare a grounded prompt for OpenAI so it recommends from `cards` only.
    const productContext = makeProductContext(cards);

    // const systemPrompt = `You are a helpful shopping assistant for a  e-commerce site.\n\nRULES:\n- Recommend only from the provided PRODUCT LIST.\n- If no good match, say so politely and ask a short follow-up question.\n- Keep answers short and friendly (2-5 sentences).\n- Show prices in INR (₹).\n\nPRODUCT LIST:\n${productContext}`;
    const systemPrompt =  `You are a helpful shopping assistant. The user asked: "${message}". 
    We have the following products:${productContext}.
    Reply to the user in a friendly tone and suggest available products if any. 
    If no products match, say "Sorry, we don't have that right now."`;

    // 5) Call OpenAI chat completion API to generate a friendly answer.
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // cost-effective model. You can change to `gpt-4o` for higher quality.
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      // temperature controls creativity. Start moderate; adjust after testing.
      temperature: 0.6,
    });

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply.";

    // 6) Return JSON shaped for the frontend chat UI. We send back raw cards so UI can show image/name/price.
    res.json({ reply, products: cards });
  } catch (err) {
    console.error("[AI chat] Error:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};
