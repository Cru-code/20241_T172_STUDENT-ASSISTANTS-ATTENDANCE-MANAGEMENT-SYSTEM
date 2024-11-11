import express from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from 'cors';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const CorsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true
}

app.use(express.json()); // alows json data in the req.body
app.use(cors(CorsOptions));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
    console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
});

