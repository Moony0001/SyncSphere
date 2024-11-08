import Notification from "../models/notification.model";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({to: userId})

        await Notification.updateMany({to: userId}, {read: true});

        res.status(200).json(notifications);
        
    } catch (error) {
        console.log("Error in getNotifications controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}