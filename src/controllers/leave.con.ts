import mongoose from "mongoose";
import USER from "../models/user.model";
import { Request, Response } from "express";
import { RegisterBody, leavesSchema } from "../validations/leave.vali";

import LEAVE from "../models/leave";






export const leavemanager = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const result = leavesSchema.safeParse(req.body);
    const userId = req.user.id;
    const userexist = await USER.findById(userId);

    if (!userexist) {
      return res.status(400).json({
        success: false,
        message: "No User Exist's",
      })
    }

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.flatten().fieldErrors,
      });
    }


    if (result.data.startDate.getTime() > result.data.endDate.getTime()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Data"
      })
    }

    const now = new Date();

    const today = now;
    today.setHours(0, 0, 0, 0);

    const startDates = new Date(result.data.startDate);
    startDates.setHours(0, 0, 0, 0)

    if (startDates.getTime() <= today.getTime()) {
      return res.status(400).json({
        success: false,
        message: "U need to apply 1 day before"
      })
    }

    const duration = (result.data.endDate.getTime() - result.data.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

    if (duration > 5) {
      return res.status(400).json({
        success: false,
        message: "U need Can't Apply leave for more than 4 days"
      })
    }



    const leaveexist = await LEAVE.findOne({
      userId,
      approval: { $ne: "rejected" },
      startDate: { $lte: result.data.endDate },
      endDate: { $gte: result.data.startDate },


    });

    if (leaveexist) {
      return res.status(400).json({
        success: false,
        message: "Leave already Exists",
      })
    }

    const leavecreated = await LEAVE.create({
      userId,
      ...result.data,
    });




    return res.status(201).json({
      success: true,
      message: "Leave application created successfully",
      leavecreated,
    })








  }



  catch (error: any) {
    console.error("Error in Applying Leave", error)
    return res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

export const getleave = async (req:Request , res:Response) =>{
  try {
    
  
      const userId = req.user.id
     
      const userexist = await USER.findById(userId);
  
     

    if (!userexist) {
      return res.status(400).json({
        success: false,
        message: "No User Exist's",
      })
    }

     const leaveexist = await LEAVE.find({userId}).sort({createdAt:-1});

    if (leaveexist.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Leave Exists",
      })
    }

    return res.status(200).json({
        success: true,
        message: " Your all leaves",
        leaveexist,
      })
    }
      catch (error) {
       return res.status(500).json({
            success:false,
            message:"Server Error",
       })
  }

} 

export const getallleave = async (req:Request , res:Response) =>{ 
  try{
     const { search , leaveType , approval , page = 1 , limit = 10} = req.query;

     const query: any = {};

       if(approval) query.approval = approval;
       if(leaveType) query.leaveType  = leaveType;

       if(typeof search === "string"){
           const users = await USER.find({
            username:{$regex : search , $options:"i"}
           }).select("_id")
       

       query.userId = {
         $in : users.map(user => user._id )
       }
      }

      const  leaves = await LEAVE.find(query)
      .populate("userId" , "username")
      .sort({createdAt : -1})
      .skip((Number(page)-1) * Number(limit))
      .limit(Number(limit));

        return res.status(200).json({
    success:true,
    message:"Particular Users Displyed",
    leaves
   })
       
}
catch(error :unknown){
  return  res.status(500).json({
    success:false,
    message:"SERVER ERROR"

   })

}
}