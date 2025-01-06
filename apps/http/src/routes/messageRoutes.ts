import express from "express";

const router = express.Router();

//controllers import
import { setMessage,getMessages } from "../controllers/messageController";
//Set messages
router.post("/",setMessage);

router.get("/",getMessages);

export default router;
