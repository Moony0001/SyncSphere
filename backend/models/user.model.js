import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true,
        minLength: 8
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    weight: {
        type: Number,
        default: 0
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profileImg: {
        type: String,
        default: ""
    },
    activities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
            default: []
        }
    ],
    clubs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
            default: []
        }
    ],
}, {timeStamps: true});

const User = mongoose.model("User", userSchema);

export default User;