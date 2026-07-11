import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

//Controllers me hamesha buisness logic rakhte hai..
export const register=async(req,res)=>{
    try{
        const {fullname,username,password,confirmPassword,gender}=req.body;
        //validation
        if(!fullname || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        if(password !== confirmPassword){
            return res.status(400).json({
                message:"password do not matche with confirmed password"
            }) 
        }
        //creating user
        const user=await User.findOne({username})
        if(user){
            //if user already exist
            return res.status(400).json({
                message:"Username already exist try different"
            }) 
        }
        const hashedPassword=await bcrypt.hash(password,10);
        // const maleProfilePhoto= `https://avatar.iran.liara.run/public/boy?username=${username}` 
        // const femaleProfilePhoto= `https://avatar.iran.liara.run/public/girl?username=${username}` 
        
        const maleProfilePhoto= `https://api.dicebear.com/7.x/micah/svg?seed=${username}` 
        const femaleProfilePhoto= `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${username}` 
        
        await User.create({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profilePhoto: gender=="male"? maleProfilePhoto: femaleProfilePhoto
        })
        return res.status(201).json({
            message:"Account Created Successfully",
            success: true
        })
    }catch(err){
        console.log(err);               
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

//login
export const login=async(req,res)=>{
    try{
        const {username, password}=req.body;
        if(!username || !password){
             return res.status(400).json({
                message:"All fields are required"
            })
        }
        const user=await User.findOne({username})
        if(!user){
            //if user already exist
            return res.status(400).json({
                message:"User not exist"
            }) 
        }
        const isPasswordMatch=await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Password is Incorrect"
            }) 
        }
        const tokenData={
            userId: user._id,
        }
        const token= await jwt.sign(tokenData, process.env.JWT_SECURITY_KEY,{expiresIn: '1d'});
        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        }).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            profilePhoto: user.profilePhoto,
            success: true,
            message: "Logged in Successfull"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout=async(req,res)=>{
    try{
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        }).json({
            message:"User logged Out successfully."
        })
    }catch(err){
        console.log(err);
    }
}


export const getOtherUser=async(req,res)=>{
    try{
        const loggedInUserId= req.id;
        const otherUser=await User.find({_id:{$ne: loggedInUserId}}).select("-password");
        return res.status(200).json(otherUser);
    }catch(err){
        console.log(err);
    }
}