import express from "express"
import { getBlockChain, createNewBlock } from "./blockChain";

const app = express();
const PORT: number = 3500;

app.get("/", (req, res) => {
    createNewBlock("are")
    console.log(getBlockChain());
    res.send("Hello World");
})

app.listen(PORT, () => console.log(`Running server: http://localhost:${PORT}`))