import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

//models
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select("-password");
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const followUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()){
            return res.status(403).json({error: "You can't follow yourself"});
        }

        if(!userToModify || !currentUser){
            return res.status(404).json({error: "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);

        //If the user is already following someone, hitting the follow button will unfollow the user
        if(isFollowing){
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

            res.status(200).json({message: "User unfollowed successfully"});
        }//If the user is not following the user, hitting the follow button will follow the user
        else{
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            //Send notification to the user
            const newNotification  = new Notification({
                to: id,
                icon: currentUser.profileImg,
                title: "New Follower",
                text: `${currentUser.firstname} ${currentUser.lastname} started following you! Follow them back!`,
                actionable_link: `/profile/${currentUser._id}`,
                display_date: new Date(),
                category: "follow",
                read: false
            })
            await newNotification.save();
            res.status.json({message: "User followed successfully"});
        }
    } catch (error) {
        console.log("Error in followUser controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {sample: {size: 10}}
        ])

        const filteredUsers = users.filter(user => usersFollowedByMe.following.includes(user._id.toString()));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach(user => {
            user.password = undefined;
        })
        res.status(200).json(suggestedUsers);
        
    } catch (error) {
        console.log("Error in getSuggestedUsers controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateUser = async (req, res) => {
    const {firstname, lastname, email, currentPassword, newPassword, gender, bio, weight} = req.body;
    let { profileImg } = req.body;
    const userId = req.user._id;
    
    try {
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        if(!newPassword && currentPassword || newPassword && !currentPassword){
            return res.status(400).json({error: "Please provide both the current password and the new password"});
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch){
                return res.status(400).json({error: "Current Password is incorrect"});
            }

            if(newPassword.length < 8){
                return res.status(400).json({error: "Password must be at least 8 characters long"});
            }

            const salt = await bcrypt.genSalt(10);  
            user.password = await bcrypt.hash(newPassword, salt); 
        }

        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        user.firstname = firstname || user.firstname;
        user.email = email || user.email;
        user.lastname = lastname || user.lastname;
        user.bio = bio || user.bio;
        user.profileImg = profileImg || user.profileImg;
        user.gender = gender || user.gender;
        user.weight = weight || user.weight;

        user =  await user.save();

        user.password = undefined;

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}
