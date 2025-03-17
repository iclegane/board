import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import process from "process";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import Auth from './routes/Auth.js';
import Board from './routes/Board.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MongoDB URI is missing");
}
// Todo: вынести
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));
// Todo: Winston/Morgan
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/v1/auth', Auth);
app.use('/api/v1/board', Board);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})

process.on("SIGTERM", () => {
    console.log("Закрываем сервер...");
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("Принудительное завершение...");
    process.exit(0);
});
