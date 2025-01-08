import express from "express";

const router = express.Router();

import { postFeedbackController,getFeedbackController } from "../controllers/feedbackControllers";

router.post('/',postFeedbackController);
router.get('/',getFeedbackController);

export default router;