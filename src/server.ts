import express from "express";
import path from "path";

const app = express();
const PORT = 3000 as const;

app.use("/dist", express.static(path.join(__dirname, 'dist')));

app.get("/", (req, res): void => {
    res.sendFile(path.join(__dirname, "index.html"));
})

const server = (): void => console.log(`Server Running: https://localhost:${PORT}`)

app.listen(PORT, server);