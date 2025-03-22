import express from "express";
import process from "process";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import Auth from './routes/Auth.js';
import Board from './routes/Board.js';
import { WSServer } from "./service/WS.js";
import { Mongo } from "./service/Mongo.js";
import { CONFIG } from './config/index.js'

const app = express();

new Mongo(CONFIG.MONGO_URI);
new WSServer(Number(CONFIG.WS_PORT));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: CONFIG.CLIENT_ORIGIN,
    credentials: true
}));
// Todo: Winston/Morgan
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/v1/auth', Auth);
app.use('/api/v1/board', Board);

app.listen(CONFIG.PORT, () => {
    console.log(`Server running at http://localhost:${CONFIG.PORT}`);
})

process.on("SIGTERM", () => {
    console.log("Закрываем сервер...");
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("Принудительное завершение...");
    process.exit(0);
});
