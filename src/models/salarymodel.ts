import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface ISalary extends Document {
    userId: mongoose.Types.ObjectId,
    month: Number,
    year: Number,
    basicSalary: number,
    bonus: number,
    deductions: number,
    allowances: number,
    leavededuction: number,
    tax: number,
    grossSalary:number,
    netSalary: number,
    paymentStatus: string,
    paymentDate: Date,
}

const SalarySchema = new Schema<ISalary>({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref:"USER",
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
    },
    bonus: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        required: true,
    },
    allowances: {
        type: Number,
        required: true,
    },

    leavededuction: {
        type: Number,
        required: true,
    },

    tax: {
        type: Number,
        required: true,
    },
     grossSalary: {
        type: Number,
        required: true,
    },
     netSalary: {
        type: Number,
        required: true,
    },

    paymentStatus:{
        type:String,
        enum:["pending" , "paymentDone" , "Failed"],
        default:"pending",
    },

     paymentDate:{
        type:Date,
        required:true,
    }





},
 {timestamps:true},
)


const SALARY = mongoose.model<ISalary>("SALARY" , SalarySchema)

export default SALARY;