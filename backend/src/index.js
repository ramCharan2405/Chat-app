import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

import{connectDB} from './lib/db.js';
dotenv.config(); // Load environment variables first

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

const app = express();
const PORT = process.env.PORT || 5000; 
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});
