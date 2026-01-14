import mongoose from "mongoose";
import asyncHandler from "utils/asyncHandler.js";
import ApiError from "utils/apiError.js";
import { Course } from "../models/course.model.js";
import { CourseSearch } from "../models/CourseSearch.model.js";
import { Section } from "../models/section.model.js";
import { Lecture } from "../models/lecture.model.js";
import { Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const createCourse = asyncHandler(async (req, res) => {
    const { title, subtitle, description, price, level, language, category } = req.body;
    const instructorId = req.user._id;
    if (!title || !description || !level || !language) {
        throw new ApiError(400, "All required fields must be provided");
    }
    if (!category || category.name === "") {
        throw new ApiError(400, "Category is required");
    }
    const instructor = User.findById(instructorId);
    if (!instructor) {
        throw new ApiError(404, "Instructor not found");
    }

    if (!req.file) {
        throw new ApiError(400, "Thumbnail file is required");
    }
    const thumbnailLocalPath = req.file.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail path not found is required");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    if (!category || category.name === "") {
        throw new ApiError(400, "Category is required");
    }
    const finalCategory = await Category.create({ name: category.name, description: category.description || "" });

    if (!finalCategory) {
        throw new ApiError(500, "Failed to create category");
    }

    const course = await Course.create({
        title,
        subtitle,
        description,
        price,
        level,
        language,
        category: finalCategory._id,
        thumbnail: thumbnail.url,
        instructor
    });

    if (!course) {
        throw new ApiError(500, "Failed to create course");
    }

    console.log("Created course:", course);
    return res.status(201)
        .json({
            status: "success",
            message: "Course created successfully",
            data: course
        });
});

const updateCourseDetails = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    const updatedDetails = req.body;
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this course");
    }
    if (req.body === undefined) {
        throw new ApiError(400, "No data provided for update");
    }
    console.log("Request Body: ", req.body);
    if (updatedDetails.category.description) {
        const category = await Category.findById(course.category);
        if (category) {
            category.description = updatedDetails.category.description;
            await category.save({ withoutValidateBeforeSave: true });
        }
    }

    allowedFields = [
        title,
        subtitle,
        description,
        price,
        level,
        language,
    ];
    updatedData = {};
    for (const key in allowedFields) {
        if (updatedDetails[key] !== undefined) {
            updatedData[key] = updatedDetails[key];
        }
    }
    console.log("Updated Data: ", updatedData);

    const courseUpdated = await Course.findByIdAndUpdate(
        courseId,
        { $set: updatedData },
        { new: true, runValidators: true }
    );
    console.log("Updated Course: ", courseUpdated);
    return res.status(200)
        .json({
            status: "success",
            message: "Course updated successfully",
            data: courseUpdated
        });
});


const updateCourseThumbnail = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this course");
    }
    if (!req.file) {
        throw new ApiError(400, "Thumbnail file is required");
    }
    const thumbnailLocalPath = req.file.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail path not found is required");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }
    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $set: { thumbnail: thumbnail.url } },
        { new: true }
    );

    if (!updatedCourse) {
        throw new ApiError(500, "Failed to update course thumbnail");
    }

    return res.status(200)
        .json({
            status: "success",
            message: "Course thumbnail updated successfully",
            data: updatedCourse
        });
});

const publishingCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
    .populate("category", "name description")
    .populate("instructor", "fullName isVerified");
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to publish this course");
    }

    if (course.instructor.isVerified === false) {
        throw new ApiError(403, "Only verified instructors can publish courses");
    }

    if (
    !course?.title?.trim() ||
    !course?.description?.trim() ||
    !course?.thumbnail
) {
    throw new ApiError(
        400,
        "Course title, description, and thumbnail are required to publish the course"
    );
}

    if (course.category.description === "" || course.category.description === null) {
        throw new ApiError(400, "Category description is required to publish the course");
    }

    
     const sections = await Section.find({ course: courseId }).select("_id");
        if (sections.length === 0) {
            throw new ApiError(
                400,
                "At least one section is required to publish the course"
            );
        }
        const sectionIds = sections.map(section => section._id);

        const lectureExists = await Lecture.exists({
            section: { $in: sectionIds }
        });

        if (!lectureExists) {
            throw new ApiError(
                400,
                "At least one lecture is required to publish the course"
            );
        }
    
    course.isPublished = "published";
    const updatedCourse = await course.save({ validateBeforeSave: true });
    if (!updatedCourse) {
        throw new ApiError(500, "Failed to publish course");
    }

    await CourseSearch.findOneAndUpdate(
    { courseId: course._id },
    {
      courseId: course._id,
      title: course.title,
      description: course.description,
      instructorName: course.instructor.fullName,
      tags: course.tags,
      category: course.category,
      price: course.price,
      language: course.language,
      level: course.level,
      publishedAt: course.publishedAt
    },
    { upsert: true, new: true }
  );

    return res.status(200)
        .json({
            status: "success",
            message: "Course published successfully",
            data: updatedCourse
        });
});

export {
    createCourse,
    updateCourseDetails,
    updateCourseThumbnail
};