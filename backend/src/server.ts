import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import router from "./routes";

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

// Serve static files
app.use("/static", express.static(path.resolve(__dirname, "../static")))

app.listen(process.env.PORT || 8000, () => {
    console.log(`\nServer listening on PORT ${process.env.PORT}\n`)
})