import mongoose, { models } from "mongoose";
import { Document , Schema } from "mongoose";

export interface IAttendence extends Document{
  userId:mongoose.Types.ObjectId,
  checkin:Date,
  checkout:Date,
  currstatus:string,
  currtime:Date,
  date:Date,
  workinghours:Number,
} 

const AttendenceSchema = new Schema<IAttendence>({
      userId:{
          type:mongoose.Schema.Types.ObjectId,
          required:true,
      },
      currstatus:{
        type:String,
        enum:["Absent" , "onLeave" , "Present" ],
        required:true,
      },
    
      date:{
        type:Date,
        required:true,    
      },

      checkin:{
       type:Date,
       required:true,
      },

       checkout:{
       type:Date,
       default:null,
      },

       currtime :{
        type:Date,
        required:true,    
      },
      workinghours:{type:Number,
        required:true,
      }

    },
     {timestamps:true}
)


const ATTENDENCE = mongoose.model<IAttendence>("ATTENDENCE" , AttendenceSchema);

export default ATTENDENCE;