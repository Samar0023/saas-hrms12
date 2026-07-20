import mongoose from "mongoose";
import ATTENDENCE from "../models/attendence";
import USER from "../models/user.model";
import { Response , Request } from "express";
import { optional } from "zod";


 interface RegisterBody{
  userId:mongoose.Types.ObjectId,
   checkin:Date,
  checkout:Date,
  currstatus:string,
  date:Date,
  currtime:Date,
  workinghours:number,

} 

export const checkinhere = async (req:Request  , res:Response)=>{
    try{
   const  userId  = req.user.id;
     const userexist = await USER.findById(userId) 
      if(!userexist){
       return res.status(400).json({
          success:false,
          message:"No User Exist's"  
        })
      }
 

    const day = new Date();

    if(day.getDay() === 0 ){
        return res.status(400).json({
           success:false,
           message:"Today's No Attendance will be recorded As of Sunday", 
        })
    }
      
   

      const hour = day.getHours()
     
   
        if(hour > 11  || hour < 9){
         return res.status(400).json({
           success:false,
           message:"Invalid Chekin Time", 
        })
        }

            const Starttime = new Date(day)
            Starttime.setHours(0 , 0,0,0)

            const endtime = new Date(day)
           endtime.setHours(23 , 59,59,999)
      

           const existatt = await ATTENDENCE.findOne({
          userId,
           date:{
          $gte:Starttime,
           $lte:endtime
           },
      })

      if(existatt){
         return res.status(400).json({
           success:false,
           message:"Today's  Attendance is  Already Marked", 
        })
      }

    const record = await ATTENDENCE.create({
       userId,
        currstatus:"Present",
        date: day,
        checkin:day,
        currtime:day,
    })

     return res.status(201).json({
           success:true,
           message:"Attendence Marked Successfully", 
           record,
        })

}
catch(error : any){
      return res.status(500).json({
           success:false,
           message:"Server Error During Marking Attendence"
  
        })
}

}

export const checkouthere = async (req:Request , res:Response)=>{
    try{
     const  userId  = req.user.id;
     const userexist = await USER.findById(userId) 
      if(!userexist){
       return res.status(400).json({
          success:false,
          message:"No User Exist's"  
        })
      }
   const day = new Date();
    
    

       const starttime = new Date(day)
            starttime.setHours(0 , 0,0,0)

            const endtime = new Date(day)
           endtime.setHours(23 , 59,59,999)


           const attendence = await ATTENDENCE.findOne({
             userId,
                date:{
                   $lte:endtime,
                   $gte:starttime
                }
           })

           if(!attendence){
           return  res.status(400).json({
              success:false,
              message:"Chekin Does'nt Exist"
            })
           }


           if(attendence?.checkout){
        return res.status(400).json({
          success:false,
          message:"U Already Chekout"
        })
       }

       const  workingsecs = day.getTime() - attendence.checkin.getTime();

      const  workingHours = workingsecs/(1000*60*60);

          

      const record = await ATTENDENCE.findOneAndUpdate({
        userId,
        date:{
           $lte:endtime,
           $gte:starttime
        },
      },
      {

         $set:{checkout:day,
               workinghours:workingHours ,
         }
      },
      {
        new:true,
      }
  
  )

      


 return res.status(201).json({
           success:true,
           message:"Checkout Marked Successfully", 
           record,
        })

        
         


    }
   catch(error : any){
      return res.status(500).json({
           success:false,
           message:"Server Error During CheckOut"
  
        })
}
}

export const getallattendence = async (req:Request , res:Response) =>{
     try {
          const {search  , currstatus , page = 1 , limit = 10 } = req.query;

          const query : any = {};
   
            if(currstatus) query.currstatus = currstatus;
            
            if(search){
               const users = await USER.find({
                    username: {$regex:search , $options:"i"}
               }).select("_id");

          query.userId = {
                $in:users.map(user => user._id)
               }

            

            }

             const attendences = await ATTENDENCE.find(query)
             .populate("userId" , "username" )
             .sort({created:-1})
             .skip((Number(page)-1) * Number(limit) )
             .limit(Number(limit))

  return res.status(200).json({
    success:true,
    message:"Particular Users Displyed",
   attendences,

   })

     } catch (error) {
      return res.status(500).json({
    success:false,
    message:"SERVER ERROR"
   })
     }
}

export const getmyattendence = async (req:Request , res:Response) =>{
  try{
    const userId = req.user.id;

    const userexist = await USER.findById(userId);

      if (!userexist) {
      return res.status(400).json({
        success: false,
        message: "No User Exist's",
      })
    }

    const myattendence = await ATTENDENCE.find({userId}).sort({createdAt:-1});

    if(myattendence.length === 0){
         return res.status(200).json({
      success:true,
      message:"No Attendence Exists",
    })
    }

    return res.status(200).json({
      success:true,
      message:"Your Attendence",
      myattendence,
    })

}
   catch(error:any){
     return  res.status(500).json({
    success:false,
    message:"SERVER ERROR",
   })
   }
}

