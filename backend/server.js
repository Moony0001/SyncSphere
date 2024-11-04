import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectMongoDB from "./db/connectMongoDB.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true})); //extended: true allows to parse extended bodies with rich data in it
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`);
    connectMongoDB();
})