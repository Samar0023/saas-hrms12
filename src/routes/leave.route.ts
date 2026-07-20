import express from "express"

import {leavemanager , getallleave , getleave} from "../controllers/leave.con"
import {authmiddleware , AuthRequest } from "../middleware/auth.middleware"
const router = express.Router();


router.post("/addleave" , authmiddleware, leavemanager);
router.get("/allleaves" , authmiddleware, getallleave);
router.get("/myleave" , authmiddleware,  getleave);

export default router;
