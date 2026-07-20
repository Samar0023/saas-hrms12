import mongoose from "mongoose";
import { Document , Schema } from "mongoose";

export interface IUser extends Document{
    username:string;
    password:string;
    email:string;
    designation:string;
    role:string;
    department:string;
    isActive:boolean;
}

const UserSchema =  new Schema<IUser>({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    designation:{
        type:String,
        required:true,

    },
    role:{
        type:String,
        enum:["employ" , "hr" , "admin" , "manager"],
        default:'employ'
    },
    department:{
        type:String,
        required:true,
    },
    isActive:{
        type:Boolean,
        required:true,
    }


},
 {timestamps:true}
)

const USER = mongoose.model<IUser>('USER' , UserSchema);

export default USER;