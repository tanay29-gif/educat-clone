import asyncHandler from "express-async-handler";
import Lecture from "../models/lecture.model.js";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createLecture = asyncHandler(async (req, res) => {
  const { title, order, isPreview } = req.body;
  const { section } = req.params;

  // Validate required fields
  if (!title || !req.file || !order) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Video file is required" });
  }
  const lectureUrl = req.file.path;

  // Upload video to Cloudinary
  const uploadedLecture = await uploadToCloudinary(lectureUrl, "lectures");
  if (!uploadedLecture) {
    return res.status(500).json({ message: "Failed to upload video" });
  }
  if(!uploadedLecture.duration){

  }


  // Create lecture
  const lecture = await Lecture.create({
    title,
    videoUrl,
    duration,
    section,
    order,
    isPreview: isPreview || false
  });

  res.status(201).json(lecture);
});