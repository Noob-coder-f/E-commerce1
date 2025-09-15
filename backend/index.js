import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoute from './routes/user.route.js';
import connectDB from './config/db.js';
import adminRoute from './routes/admin.route.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

// ✅ Allow multiple domains
const allowedOrigins = [
  "http://localhost:5173",
  "https://e-commerce1-faishal.vercel.app"
];

// ✅ CORS setup with OPTIONS handling
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors()); // ✅ handle preflight requests

// --- Test routes ---
app.get("/", (req, res) => res.send("Hello Faishal!"));
app.get("/health", (req, res) => res.send("OK"));

// --- Database ---
connectDB();

// --- Server + Socket.io ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// --- Socket logic ---
let adminSocket = null;
io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  socket.on("adminConnected", () => {
    adminSocket = socket;
    socket.join("admins");
    console.log("✅ Admin connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    if (adminSocket?.id === socket.id) adminSocket = null;
  });
});

app.set("io", io);

// --- Routes ---
app.use("/api", userRoute);
app.use("/api", adminRoute);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { io, adminSocket };
