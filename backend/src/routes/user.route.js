import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    registerUser,
    logoutUser,
    getCurrentUser,
    updateUserProfile,
    updateAvatar,
    deleteUser,
    refreshAccessToken,
    loginUser,
    changePassword
} from "../controllers/user.controller.js";

const router = Router();

// Define user-related routes here

router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/profile").get(verifyJWT, getCurrentUser);
router.route("/profile").put(verifyJWT, updateUserProfile);
router.route("/avatar").put(verifyJWT, upload.single('avatar'), updateAvatar);
router.route("/:id").delete(verifyJWT, deleteUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;

// /api/search/courses fr course search functionality