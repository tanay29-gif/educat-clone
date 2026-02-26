import mongoose from "mongoose";
import { asyncHandler } from "../utils/asycHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Section } from "../models/section.model.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

export const createSection = asyncHandler(async (req, res) => {
  const { title, order } = req.body;
  const { courseId } = req.params;

  // Validate required fields
  if (!title || !order) {
    throw new ApiError(400, "Missing required fields");
  }

  // Verify course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Create section
  const section = await Section.create({
    title,
    course: courseId,
    order
  });
  console.log("Created section:", section);

  return res.status(201).json(new ApiResponse(201, "Section created successfully", section));
});

export const getSectionsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Verify course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Get all sections for the course, sorted by order
  const sections = await Section.find({ course: courseId })
    .populate("lectures")
    .sort({ order: 1 });

  return res.status(200).json(new ApiResponse(200, "Sections fetched successfully", sections));
});

export const updateSection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const { title, order } = req.body;

  // Validate section exists
  const section = await Section.findById(sectionId);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  // Verify course exists (section belongs to this course)
  const course = await Course.findById(section.course);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Update section
  const updatedSection = await Section.findByIdAndUpdate(
    sectionId,
    { 
      ...(title && { title }),
      ...(order !== undefined && { order })
    },
    { new: true, runValidators: true }
  );

  console.log("Updated section:", updatedSection);
  return res.status(200).json(new ApiResponse(200, "Section updated successfully", updatedSection));
});

export const deleteSection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;

  // Validate section exists
  const section = await Section.findById(sectionId);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  // Delete all lectures in this section
  await Lecture.deleteMany({ section: sectionId });

  // Delete the section
  await Section.findByIdAndDelete(sectionId);

  console.log("Deleted section:", sectionId);
  return res.status(200).json(new ApiResponse(200, "Section deleted successfully", null));
});