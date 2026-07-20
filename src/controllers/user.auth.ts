import USER from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {signSchema, RegisterBody } from "../validations/user.vali"
import { Request , Response } from "express";




export const signup = async (req:Request <{} , {} , RegisterBody> , res:Response)=>{
      try {
        
           const result = signSchema.safeParse(req.body);

           if(!result.success){  return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,        })}

             const existingUser = await USER.findOne({
      email: result.data.email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

           const hashpass = await bcrypt.hash(result.data.password, 10)

      const created = await USER.create({
          ...result.data,
          password:hashpass
      })

        if(!process.env.JWT_SECRET){
             throw new Error ("Jwt not configured");
        }

        const token = jwt.sign(
          {id:created._id,
              role: created.role,
          },
          process.env.JWT_SECRET,
          {expiresIn:'7d'}
        )

        res.cookie("token" , token ,{
          httpOnly:true,
          sameSite:"none",
          secure:true,
          maxAge:7*1000*60*60*24,
        })

        return res.status(201).json({
             success:true,
             message:"Successfully SignUp",
             userId:created._id,
        })



          
      } catch (error : any) {
          console.error("Error in SignUp" , error)
           return res.status(500).json({
             success:false,
             message:"Server Error",
            })  
      }
}

export const login = async(req:Request , res:Response) =>{
   try {
          const {email , password} = req.body;

          if(!email || !password){
             return res.status(400).json({
                  success:false,
                  message:"All Particular Fields are Required",
            })
          }
           
           if(password.length <= 5){
              return  res.status(400).json({
                      success:false,
                      message:"Password length should be more than 5"
               })
           }
 
           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

               if(!emailRegex.test(email)){
                  return  res.status(400).json({
                       success:false,
                       message:"Email Format is not correct"
                   })
                }


                const user = await USER.findOne({email})

           if(!user){
             return res.status(404).json({
                     success:false,
                     message:"User doesn't  Exist"
                })
           }

           const correctPass = await bcrypt.compare(password , user.password);

           if(!correctPass){
             return res.status(400).json({
                     success:false,
                     message:"Invalid Credentials"
                })
           }

           if(!process.env.JWT_SECRET){
            throw new Error("jwt not configured")
           }

           const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"},
           )

           res.cookie("token" , token ,{
             secure:true,
             httpOnly:true,
             sameSite:"none",
             maxAge:7*1000*24*60*60,
           })

           return res.status(200).json({
            success:true,
            message:"Login Successfully",
            user:{
        userId:user._id,
        email:user.email,
        username:user.username
            }
           })



           
   } catch (error) {
       console.error("Error in Login" , error)
           return res.status(500).json({
             success:false,
             message:"Server Error",
            })  
   }
}


export const logout = async(req:Request , res:Response) =>{
     res.cookie("token" , "" , {maxAge:0});
     res.json({message:"logout Successfull"})
}