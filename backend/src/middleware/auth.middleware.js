import jwt from "jsonwebtoken"
import { db } from "../libs/db.js";

export const authMiddleware = async(req , res , next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(400).json({
                message:"no token"
            })
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        console.log(decoded);
        let id = decoded.id
        
        const user = await db.user.findUnique({
                where:{
                    id:id
                },
                select:{
                    id:true,
                    name:true,
                    email:true,
                    // image:true,
                    role:true,
                    createdAt:true,
                    updatedAt:true
                }
            })
        console.log(user);
        if(!user){
            return res.status(400).json({message:"token invalid"})
        }
       req.user = user
        next()
    }
     catch (error) {
       return res.status(400).json({
            message:"Catch error in Middleware"
        })
    }
  
}


export const checkAdmin = async(req , res , next) => {
    try {
        const userId = req.user
        const user = await db.user.findUnique({
            where:{
                id:userId
            },
            select:{
                role:true
            }
        })
        if(!user || user.role !== ADMIN){
            return res.status(400).json({
                message:"Forbidden Entry :- Not an admin"
            })
        }
        next()

    } catch (error) {
        return res.status(400).json({
            message:`${error} this is catch error of check Admin`
        })
    }
}