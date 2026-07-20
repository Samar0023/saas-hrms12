import mongoose from "mongoose";
import USER from "../models/user.model";
import SALARY from "../models/salarymodel";
import { Request , Response } from "express";



interface RegisterBody{
    userId: mongoose.Types.ObjectId,
       month: number,
       year: number,
       basicSalary: number,
       bonus: number,
       deductions: number,
       allowances: number,
       leavededuction: number,
       tax: number,
      
       paymentStatus: string,
       paymentDate: Date,
}

export  const salarygiven = async (req:Request < {} , {}  , RegisterBody>, res:Response) =>{
     try {
          const {userId , month , year , basicSalary , bonus , deductions , allowances , leavededuction , tax  , paymentStatus} = req.body;
           const user = await USER.findById(userId);

            if(!user){
               return res.status(400).json({
                    success:false,
                    message:`Particular User Don't Exists `
                })
            }

            if(month < 1 || month > 12){
                  return res.status(400).json({
                    success:false,
                    message:"Invalid Month Data"
                }) 
            }



             
             
            const fields = {
               basicSalary,
               bonus,
               deductions,
               allowances,
               leavededuction,
               tax,
            }

             for(const [field , value] of Object.entries(fields)){
               if(value < 0 ){
                return res.status(400).json({
                    success:false,
                    message:`${field} Cannot be Negative`
                })
            }
         }

         if(basicSalary > 1000000){
            return res.status(422).json({
               success:false,
               message:"Salary unrealastically high",
            })
         }

         const validStatus = ["pending" , "paymentDone" , "Failed"]
          if(!validStatus.includes(paymentStatus)){
                return res.status(400).json({
                success:false,
               message:"Invalid Payment details", 
            })
          }

         const salaryexist = await SALARY.findOne({userId , month , year})

         if(salaryexist){
            return res.status(400).json({
                success:false,
               message:"Salary for this particular User already Exist", 
            })
         }
          
          const now = new Date();

          const grossSalary = basicSalary + bonus + allowances;
          const netSalary = grossSalary - tax - leavededuction - deductions

         const createdsal = await SALARY.create({
               userId,
               month,
               year, 
               basicSalary,
               bonus,
               deductions,
               allowances,
               leavededuction,
               tax,
               grossSalary,
               netSalary,
               paymentStatus,
               paymentDate:now,
         })

           return res.status(201).json({
               success:true,
               message:"Salary for User Created",
               createdsal,
            })

    


   
     } catch (error : unknown) {
          return res.status(500).json({
               success:false,
               message:"Server Error",
            })
     }
}

 export const  getmySalary = async(req:Request , res:Response) =>{
          try {
             const userId = req.user.id;
            const userexist = await USER.findById(userId);

              if (!userexist) {
      return res.status(400).json({
        success: false,
        message: "No User Exist's",
      })
    }

    const yoursalary = await SALARY.find({userId}).sort({createdAt:-1});

       return res.status(200).json({
        success: true,
        message: "Your Salary",
        yoursalary
      })


          } catch (error : any) {
            return res.status(500).json({
        success: false,
        message: "Server Error",
      })
          }
}

 export const getallSalary = async(req:Request , res:Response) =>{
  try {
      
         const {search ,paymentStatus , page = 1 , limit = 10 } = req.query
     const query : any = {}

      if(paymentStatus) query.paymentStatus = paymentStatus

      if(search){
         const users = await USER.find({username:{$regex:search , $options:"i"}}).select("_id");

          
         query.userId = { $in :users.map(user=>user._id) }

      }

      const salaries = await SALARY.find(query)
      .populate("userId" , "username")
      .sort({createdAt : -1})
      .skip((Number(page)-1) * Number(limit) )
      .limit(Number(limit))
  } catch (error) {
        return res.status(500).json({
        success: false,
        message: "Server Error",
      })
  }

}
  