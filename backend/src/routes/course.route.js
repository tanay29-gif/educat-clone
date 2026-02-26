import { Router } from "express";
import { createCourse,
        updateCourseDetails,
        updateCourseThumbnail,
        publishingCourse,
        searchCourses,
        getCourseDetail,
        listCourses,
        getMyCourses,
        getEnrolledCourses
 } from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/create").post(verifyJWT, upload.single("thumbnail"), createCourse);
router.route("/instructor/my-courses").get(verifyJWT, getMyCourses);
router.route("/student/enrolled").get(verifyJWT, getEnrolledCourses);
router.route("/:courseId").put(verifyJWT, updateCourseDetails);
router.route("/:courseId/thumbnail").put(verifyJWT, upload.single("thumbnail"), updateCourseThumbnail);
router.route("/:courseId/profile").get(verifyJWT, getCourseDetail);
router.route("/:courseId/publish").post(verifyJWT, publishingCourse);
router.route("/").get(listCourses);
router.route("/search").get(searchCourses);

export default router;