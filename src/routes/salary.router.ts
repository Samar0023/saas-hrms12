import express  from "express";
import adminMiddleware from "../middleware/admin.middleware"; 
import { salarygiven , getallSalary , getmySalary} from "../controllers/salary"
import {authmiddleware , AuthRequest } from "../middleware/auth.middleware"

const  router  = express.Router();

router.post("/salarytaken" , authmiddleware , adminMiddleware, salarygiven );
router.get("/allsalaries" , authmiddleware, adminMiddleware,  getallSalary );
router.get("/yoursalary" ,  authmiddleware ,getmySalary );

export default router;