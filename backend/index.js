
import express from 'express';

import http from 'http';
import { Server } from 'socket.io';   //it uses websocket protocol to send real time notification to admin

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4000;
import cors from 'cors';

import userRoute from './routes/user.route.js';
import connectDB from './config/db.js';
import adminRoute from './routes/admin.route.js';

import razorpay from 'razorpay';
import paymentLink from './routes/payment.route.js';

import aiRoute from './routes/ai.route.js';

// import razorpayRoutes from './routes/razorpay.route.js';
// import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
// app.use(cors()); // Middleware to enable CORS
app.use(cors({
  origin:[ process.env.CLIENT_URL || "http://localhost:5173",
  "https://e-commerce1-faishal.vercel.app"],
  credentials: true
}));


//Razorpay instance

export const razorpayInstance=new razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})

app.use('/api',paymentLink)


// app.use(cookieParser()); // Middleware to parse cookies

app.get('/',(req,res)=>{
    // res.cookie('name','faiashal');   //res se cookie set hoti h and req se cookie read hoti h
    res.send("helo faiashal......")
})
app.get("/health", (req, res) => res.send("OK"));


//just to test cookie
// app.get('/read',(req,res)=>{
//     // res.cookie('name','faiashal');
//     console.log(req.cookies);
//     res.send("readding faiashal......")
// })


//connecting to database(mongodb)
connectDB();


const server = http.createServer(app); // create HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});




// store socket connections
let adminSocket = null;

io.on('connection', (socket) => {
  console.log("⚡ A user connected:", socket.id);

  // when admin connects
 socket.on("adminConnected", () => {
  adminSocket = socket;
  socket.join("admins");   // ✅ make admin join "admins" room
  console.log("✅ Admin connected:", socket.id);
});

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    if (adminSocket?.id === socket.id) {
      adminSocket = null;
    }
  });
});



app.set("io", io); // store io in app so routes can use it


app.use('/api',userRoute);
app.use('/api',adminRoute);
app.use('/api',aiRoute);
// app.use('/api/payments/razorpay', razorpayRoutes); // ✅ Razorpay routes

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

export { io, adminSocket };
