import express from "express";
import dotenv from "dotenv";
import process from "process";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import Auth from './routes/Auth.js';
import Board from './routes/Board.js';
import { WSServer } from "./service/WS.js";
import { Mongo } from "./service/Mongo.js";

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT;
const WS_PORT = process.env.WS_PORT;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

if (!PORT || !WS_PORT || !MONGO_URI || !CLIENT_ORIGIN) {
    throw new Error("process.env vars is missing");
}

new Mongo(MONGO_URI);
new WSServer(Number(WS_PORT));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: CLIENT_ORIGIN,
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
