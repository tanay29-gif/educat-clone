import { Router } from "express";
import {
  createSection,
  updateSection,
  deleteSection,
  getSectionsByCourse,
} from "../controllers/section.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a new section for a course
router.route("/course/:courseId").post(verifyJWT, createSection);

// Get all sections for a course
router.route("/course/:courseId").get(getSectionsByCourse);

// Update a section
router.route("/:sectionId").put(verifyJWT, updateSection);

// Delete a section
router.route("/:sectionId").delete(verifyJWT, deleteSection);

export default router;
