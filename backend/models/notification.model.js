import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    actionable_link: {
        type: String,
        required: true,
    },
    display_date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["follow", "kudos", "comment", "club_invite"]
    },
    read: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;