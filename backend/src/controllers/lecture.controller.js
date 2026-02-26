import mongoose from "mongoose";
import { asyncHandler } from "../utils/asycHandler.js";
import { Lecture } from "../models/lecture.model.js";
import { Section } from "../models/section.model.js";
import { Course } from "../models/course.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createLecture = asyncHandler(async (req, res) => {
    const { title, order, isPreview } = req.body;
    const { sectionId } = req.params;

    // Validate required fields
    if (!title || !order) {
        throw new ApiError(400, "Title and order are required");
    }

    if (!req.file) {
        throw new ApiError(400, "Video file is required");
    }

    // Verify section exists
    const section = await Section.findById(sectionId);
    if (!section) {
        throw new ApiError(404, "Section not found");
    }

    // Verify course and check if user is the instructor
    const course = await Course.findById(section.course);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the course instructor can add lectures");
    }

    // Upload video to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(req.file.path);
    if (!uploadedVideo || !uploadedVideo.url) {
        throw new ApiError(500, "Failed to upload video");
    }

    // Create lecture
    const lecture = await Lecture.create({
        title,
        videoUrl: uploadedVideo.url,
        duration: uploadedVideo.duration || 0,
        section: sectionId,
        order: parseInt(order),
        isPreview: isPreview === 'true' || isPreview === true || false
    });

    console.log("Created lecture:", lecture);

    return res.status(201).json(new ApiResponse(201, "Lecture created successfully", lecture));
});

const getLectureDetail = asyncHandler(async (req, res) => {
    const { lectureId } = req.params;
    
    const lecture = await Lecture.findById(lectureId)
        .populate("section", "title course");
    
    if (!lecture) {
        throw new ApiError(404, "Lecture not found");
    }

    return res.status(200).json(new ApiResponse(200, "Lecture fetched successfully", lecture));
});

const updateLecture = asyncHandler(async (req, res) => {
    const { lectureId } = req.params;
    const { title, order, isPreview } = req.body;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        throw new ApiError(404, "Lecture not found");
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
        lectureId,
        {
            ...(title && { title }),
            ...(order !== undefined && { order: parseInt(order) }),
            ...(isPreview !== undefined && { isPreview })
        },
        { new: true, runValidators: true }
    );

    console.log("Updated lecture:", updatedLecture);
    return res.status(200).json(new ApiResponse(200, "Lecture updated successfully", updatedLecture));
});

const deleteLecture = asyncHandler(async (req, res) => {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        throw new ApiError(404, "Lecture not found");
    }

    // Verify the user is the instructor of the course
    const section = await Section.findById(lecture.section);
    const course = await Course.findById(section.course);

    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the course instructor can delete lectures");
    }

    await Lecture.findByIdAndDelete(lectureId);

    console.log("Deleted lecture:", lectureId);
    return res.status(200).json(new ApiResponse(200, "Lecture deleted successfully", null));
});

export {
    createLecture,
    getLectureDetail,
    updateLecture,
    deleteLecture
};