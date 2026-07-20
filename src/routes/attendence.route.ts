import express  from "express"; 
import { checkinhere , checkouthere  , getmyattendence , getallattendence} from "../controllers/attendence.con"


const  router  = express.Router();

router.post("/checkin" , checkinhere);
router.post("/checkout" , checkouthere);
router.get("/myattendence" , authmiddleware, getmyattendence);
router.get("/allattendence" , getallattendence);

export default router;



