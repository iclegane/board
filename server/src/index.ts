import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello, Express with TypeScript!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
