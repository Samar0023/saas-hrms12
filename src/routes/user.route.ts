import express  from "express"; 
import { signup , login  , logout} from "../controllers/user.auth"
import {authmiddleware , AuthRequest } from "../middleware/auth.middleware"

const  router  = express.Router();

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout" , logout);
router.get("/profile" , authmiddleware , (req:AuthRequest ,  res)=>{
    res.json(req.user);
});

export default router;
