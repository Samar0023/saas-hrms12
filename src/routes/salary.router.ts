import express  from "express"; 
import { salarygiven , getallSalary , getmySalary} from "../controllers/salary"
import {authmiddleware , AuthRequest } from "../middleware/auth.middleware"

const  router  = express.Router();

router.post("/salarytaken" , authmiddleware , salarygiven );
router.get("/allsalaries" , authmiddleware, getallSalary );
router.get("/yoursalary" ,  authmiddleware ,getmySalary );

export default router;