import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subtitle: String,
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    language: {
      type: String,
      default: "English"
    },
    thumbnail: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    isPublished: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
    rating: {
      type: Number,
      default: 0
    },
    totalStudents: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
