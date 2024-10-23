import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectMongoDB from "./db/connectMongoDB";


dotenv.config();

const app = express();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`);
    connectMongoDB();
})