import express from "express" 
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js"

export const register = async(req , res) => {
    const {name , email , password} = req.body
    try {
        if(!name || !email || !password){
            return res.status(400).json({
                error : "All fields are required"
            })
        }
        console.log(email);
        
        const existingUser = await db.user.findUnique({
            where:{
                email
            }
        })
        console.log(existingUser);
        
        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword);
        
        const newUser = await db.user.create({
            data:{
                name,
                email,
                password:hashedPassword,
                role:UserRole.USER
            }
        })
        console.log(newUser);
        
        const token = jwt.sign({id:newUser.id},process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )
        res.cookie("jwt", token , {
            httpOnly : true,
            secure : process.env.NODE_ENV !== "development",
            sameSite : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message:"New User Created",
            user:{
                name:newUser.name,
                email:newUser.email,
                role:newUser.role,
                id:newUser.id,
                image:newUser.image
            }
        })
    } catch (error) {
        res.status(400).json({
            error:"Catch error in registration"
        })
    }
    
}

export const login = async(req , res) => {
    try {
        const {email , password} = req.body
        if(!email || !password){
            return res.status(400).json({
                message: "both fields required"
            })
        }
        const user = await db.user.findUnique({
            where:{
                email: email,
            }
        })
        console.log(user);
        
        if(!user){
            return res.status(400).json({
                message: "Invalid creditintials"
            })
        }
        const isMatch = await bcrypt.compare(password , user.password)
        console.log(isMatch);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid creditintials"
            })
        }
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,
            {
                expiresIn: "10d"
            }
        )
        console.log(token);
        
        res.cookie("jwt", token , {
            httpOnly : true,
            secure : process.env.NODE_ENV !== "development",
            sameSite : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            success:true,
            message:"User is Logged In"
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"catch error in LogIn"
        })
    }
    
}

export const logout = async(req , res) => {
    try {
        res.clearCookie("jwt",{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development"
        })
        res.status(200).json({
            success:true,
            message:"user Logged Out"
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"catch error in LogOut"
        })
    }
}

export const check = async(req , res) => {
    try {
        res.status(200).json({
            success:true,
            message:"User checked sucessfully",
            user:req.user
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"catch error in check"
        })
    }
}
