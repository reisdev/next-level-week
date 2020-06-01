import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/users", (req, res) => {
    res.send("Listagem de usuários");
})

app.listen(process.env.PORT || 8000);