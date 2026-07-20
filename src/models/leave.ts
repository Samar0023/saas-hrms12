import { Document , Schema } from "mongoose";
import mongoose from "mongoose";

export interface ILeave extends Document{
    userId:mongoose.Types.ObjectId,
    startDate:Date,
    endDate:Date,
    description:string,
    approval:string,
   leaveType:string,
}



const leaveSchema = new Schema<ILeave>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"USER",
        required:true,
    },
    startDate:{
        type:Date,
        required:true,

    },
    endDate:{
        type:Date,
        required:true,
    },
    description:{
        type:String,
        required:true,
         trim:true,
    },
    approval:{
        type:String,
        enum:["pending" , "approved" , "rejected"],
        default:"pending",
        required:true,
        
    },
       leaveType:{
       type:String,
       required:true,
       enum:["Casual" , "Maternity" , "Annual" , "Sick" , "Emergency"],
    },
},
     {timestamps:true}
 )

const LEAVE = mongoose.model<ILeave>("LEAVE" , leaveSchema);

export default LEAVE