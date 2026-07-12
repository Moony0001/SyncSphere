import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

import app from "./app.js";
import connectMongoDB from "./db/connectMongoDB.js";

// Configure the shared Cloudinary singleton once at startup. Every controller
// that calls cloudinary.uploader.* uses this same configured instance, so image
// uploads/deletes now have the credentials they need.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// server.js is now ONLY the entry point: load env, connect to the real
// database, and start listening. The app itself lives in app.js so it can be
// imported by tests without a live server or a real database.

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
  connectMongoDB();
});
