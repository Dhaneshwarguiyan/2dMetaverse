import express from "express";

const router = express.Router();

//controllers import 
import { loginController,signupController } from "../controllers/userControllers";

router.post("/login", loginController);
router.post("/signup", signupController);
router.get("/test", (req, res) => {
  res.send("test route");
});

export default router;
