import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
import connectDB from "./db/db"
const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config()
const PORT = 3000;
connectDB();
app.listen("/" , ()=>{
    console.log(PORT ,"Server running succesfully");
})