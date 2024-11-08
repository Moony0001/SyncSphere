import {v2 as cloudinary} from 'cloudinary';

import Club from '../models/club.model.js';
import User from '../models/user.model.js';

export const getClubs = async (req, res) => {
    try {
        const {id} = req.params;
        const club = await Club.findById(id);
        if(!club){
            return res.status(404).json({error: "Club not found"});
        }
        res.status(200).json(club);
    } catch (error) {
        console.log("Error in getClubs controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMyClubs = async (req, res) => {
    try {
        const clubs = await Club.find({ members: req.params.id });
        res.status(200).json(clubs);
    } catch (error) {
        console.log("Error in getMyClubs controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const searchClubs = async (req, res) => {
    try {
        const clubs = await Club.find({ name: { $regex: req.params.name, $options: "i" } });
        res.status(200).json(clubs);
    } catch (error) {
        console.log("Error in searchClubs controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createClub = async (req, res) => {
    try {
        const newClub = new Club(req.body);
        await newClub.save();
        res.status(201).json(newClub);
    } catch (error) {
        console.log("Error in createClub controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const joinClub = async (req, res) => {
    try {
        const {id} = req.params;
        const club = await Club.findById(id);
        const user = await User.findById(req.user._id);
        if(!club){
            return res.status(404).json({error: "Club not found"});
        }
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        
        await Club.findByIdAndUpdate(id, { $push: { members: req.user._id } });
        res.status(200).json({message: "User joined club successfully"});

    } catch (error) {
        console.log("Error in joinClub controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const leaveClub = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const club = await Club.findById(id);
        const user = await User.findById(userId);

        if(!club){
            return res.status(404).json({error: "Club not found"});
        }
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        await Club.findByIdAndUpdate(id, { $pull: { members: userId } });
        res.status(200).json({message: "User left club successfully"});
    } catch (error) {
        console.log("Error in leaveClub controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });  
    }
}

export const inviteUser = async(req, res) => {
    try {
        const {userId, clubId} = req.params;
        const user = await User.findById(userId);
        const club = await Club.findById(clubId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        if(!club){
            return res.status(404).json({error: "Club not found"});
        }
        const newNotification = new Notification({
            to: userId,
            icon: club.logo,
            title: "Club Invitation",
            text: `You have been invited to join ${club.name}`,
            actionable_link: `/clubs/${clubId}`,
            display_date: Date.now(),
            category: "club_invite",
            read: false
        });
        res.status(200).json({message: "User invited to club successfully"});
    } catch (error) {
        console.log("Error in inviteUser controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const editClub = async (req, res) => {
    const {id} = req.params;
    const {name, location, website, sport, clubType, description, invion} = req.body;
    let {logo, coverImg} = req.body;

    try {
        let club = await Club.findById(id);
        if(!club){
            return res.status(404).json({error: "Club not found"});
        }
        if(logo){
            if(club.logo){
                await cloudinary.uploader.destroy(club.logo.split("/").pop().split(".")[0]);
            }
            const uploadResponse = await cloudinary.uploader.upload(logo);
            logo = uploadResponse.secure_url;
        }
        if(coverImg){
            if(club.coverImg){
                await cloudinary.uploader.destroy(club.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadResponse.secure_url;
        }
        club.name = name || club.name;
        club.location = location || club.location;
        club.website = website || club.website;
        club.sport = sport || club.sport;
        club.club_type = clubType || club.club_type;
        club.description = description || club.description;
        club.invion = invion || club.invion;

        club = await club.save();

        res.status(200).json({message: "Club updated successfully"});
    } catch (error) {
        console.log("Error in editClub controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteClub = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const club = await Club.findById(id);
        if(!club){
            return res.status(404).json({error: "Club not found"});
        }
        if(club.admins.indexOf(userId) === -1){
            return res.status(401).json({error: "You are not authorized to delete this club"});
        }
        if(club.logo){
            await cloudinary.uploader.destroy(club.logo.split("/").pop().split(".")[0]);
        }
        if(club.coverImg){
            await cloudinary.uploader.destroy(club.coverImg.split("/").pop().split(".")[0]);
        }
        await Club.findByIdAndDelete(id);
        res.status(200).json({message: "Club deleted successfully"});
    } catch (error) {
        console.log("Error in deleteClub controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}