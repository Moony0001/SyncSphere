import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    website: {
        type: String,
        default: ""
    },
    sport: {
        type: String,
        enum: ["Cycling", "Running"],
        default: "Cycling"
    },
    club_type: {
        type: String,
        enum: ["Club", "Racing Team", "Company/Workplace", "Shop"],
        default: "Club"
    },
    description: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [] 
        }
    ],
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    club_posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ],
    vanity_url: {
        type: String,
        default: ""
    },
    invion: {
        type: Boolean,
        default: false
    }

});

const Club = mongoose.model("Club", clubSchema);

export default Club;