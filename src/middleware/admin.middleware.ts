import { NextFunction , Request , Response } from "express";
import USER from "../models/user.model";
import { AuthRequest } from "./auth.middleware";

const adminMiddleware = async (req:AuthRequest , res:Response , next:NextFunction) =>{
     try {
        if(!req.user.id){
           return res.status(400).json({message:"User does'nt Exists"});
        }

        const user =  await USER.findById(req.user.id);

        if(req.user.role !== "hr"  && req.user.role !== "admin" && req.user.role !== "manager" ){
          return  res.status(400).json({message:"Unauthorized"});
        }

        next();

     } catch (error) {
         return res.status(500).json({ message: "Server Error" });
     }
}

export default adminMiddleware;