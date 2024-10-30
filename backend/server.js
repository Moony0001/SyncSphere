import express from "express";
import dotenv from "dotenv";

import connectMongoDB from "./db/connectMongoDB.js";

import authRoutes from "./routes/auth.routes.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true})); //extended: true allows to parse extended bodies with rich data in it

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`);
    connectMongoDB();
})