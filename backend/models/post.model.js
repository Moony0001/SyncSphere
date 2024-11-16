import mongoose from "mongoose";

const postSchema =  new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
    },
    img: {
        type: String,
    },
    route: {
        type: String,
    },
    sport: {
        type: String,
        required: true,
        enum: ["Cycling", "Running", "Walking"]
    },
    time: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            type: String,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        }
    ]
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;