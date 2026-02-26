import { Router } from "express";
import {
  createLecture,
  getLectureDetail,
  updateLecture,
  deleteLecture,
} from "../controllers/lecture.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a new lecture in a section
router.route("/:sectionId").post(verifyJWT, upload.single("video"), createLecture);

// Get lecture details
router.route("/:lectureId").get(getLectureDetail);

// Update lecture details
router.route("/:lectureId").put(verifyJWT, updateLecture);

// Delete a lecture
router.route("/:lectureId").delete(verifyJWT, deleteLecture);

export default router;
