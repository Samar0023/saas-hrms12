import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
import connectDB from "./db/db"
import userRoutes from "./routes/user.route"
import salaryRoutes from "./routes/salary.router"
import leaveRoutes from "./routes/leave.route"
import attendenceRoutes from "./routes/attendence.route"
const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config()
const PORT = 3000;
connectDB();

  app.use("/api/user" , userRoutes);
  app.use("/api/attendence" , attendenceRoutes);
  app.use("/api/leave" , leaveRoutes);
  app.use("/api/salary" , salaryRoutes);

app.listen(PORT , ()=>{
    console.log(PORT ,"Server running succesfully");
})