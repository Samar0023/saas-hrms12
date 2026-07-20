import express  from "express"; 
import adminMiddleware from "../middleware/admin.middleware";
import { checkinhere , checkouthere  , getmyattendence , getallattendence} from "../controllers/attendence.con"
import {  authmiddleware } from "../middleware/auth.middleware";

const  router  = express.Router();

router.post("/checkin" , authmiddleware,checkinhere);
router.post("/checkout" , authmiddleware, checkouthere);
router.get("/myattendence" , authmiddleware, getmyattendence);
router.get("/allattendence" , authmiddleware , adminMiddleware ,getallattendence);

export default router;



