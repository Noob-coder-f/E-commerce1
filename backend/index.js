
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORt || 4000;
import cors from 'cors';

import userRoute from './routes/user.route.js';
import connectDB from './config/db.js';
import adminRoute from './routes/admin.route.js';
// import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to enable CORS

// app.use(cookieParser()); // Middleware to parse cookies

app.get('/',(req,res)=>{
    // res.cookie('name','faiashal');   //res se cookie set hoti h and req se cookie read hoti h
    res.send("helo faiashal......")
})

//just to test cookie
// app.get('/read',(req,res)=>{
//     // res.cookie('name','faiashal');
//     console.log(req.cookies);
//     res.send("readding faiashal......")
// })


//connecting to database(mongodb)
connectDB();

app.use('/api',userRoute);
app.use('/api',adminRoute);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})