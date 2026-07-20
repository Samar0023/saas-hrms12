import jwt , {JwtPayload} from "jsonwebtoken"
import USER from "../models/user.model"
import { Request, Response, NextFunction } from "express"

export interface AuthRequest extends Request{
    user:any;
}

export interface DecodedToken extends JwtPayload{
    id:string;
}

export const authmiddleware = async(req:AuthRequest , res:Response , next:NextFunction):Promise <void> =>{
    try{
      const token = req.cookies?.token;

      if(!token){
        res.status(401).json({
        success:false,
        message:"Unauthorized",
      })
      return;
      }

      const decoded = jwt.verify(token ,  process.env.JWT_SECRET as string) as DecodedToken ;

      const user = await USER.findById(decoded.id).select("-password");

      if(!user){
          res.json(401).json({
             success:false,
        message:"User not Found",
          });
          return;
      }

      req.user = user;

      next();
    
    }
    catch(error: any){
        res.status(401).json({
      success: false,
      message: "Invalid token",
     });
    }
}