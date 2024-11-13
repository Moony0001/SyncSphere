import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req, res) => {
    try {
        const {firstname, lastname, email, password, gender} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log("Email received:", email);

        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            res.status(400).json({error: "Email already taken"});
        }

        if(password.length < 8){
            return res.status(400).json({error: "Password must be atleast 8 characters long"});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstname,
            lastname,
            email,
            gender,
            password: hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                gender: newUser.gender,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            })
        }else{
            res.status(400).json({error: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid email or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        })
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const googleauth = async (req, res) => {
    try {
        passport.authenticate("google", {scope: ["email", "profile"]});
    } catch (error) {
        console.log("Error in googleauth controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const googleauthCallback = async (req, res) => {
    try {
        passport.authenticate("google", {failureRedirect: "/login"}, (req, res) => {
            res.redirect("/");
        });
    } catch (error) {
        console.log("Error in googleauthCallback controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    const {email} = profile;

    User.findOrCreate({email}, (err, user) => {
        return cb(err, user);
    })
}))