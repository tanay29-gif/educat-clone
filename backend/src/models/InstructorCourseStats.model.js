import mongoose from "mongoose";

const InstructorCourseStatsSchema = new mongoose.Schema(
  {
    // Reference to the course (source of truth)
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true,
      index: true
    },

    // Reference to instructor
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // Denormalized fields (for fast reads)
    courseTitle: {
      type: String,
      required: true,
      trim: true
    },

    courseThumbnail: {
      type: String,
      required: true
    },

    // Metrics
    studentsCount: {
      type: Number,
      default: 0,
      min: 0
    },

    totalLectures: {
      type: Number,
      default: 0,
      min: 0
    },

    totalDuration: {
      type: Number, // in seconds
      default: 0,
      min: 0
    },

    // Ratings
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    ratingsCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // Course status snapshot
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    },

    publishedAt: {
      type: Date
    },

    // Last activity timestamps
    lastEnrollmentAt: {
      type: Date
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const InstructorCourseStats = mongoose.model(
  "InstructorCourseStats",
  InstructorCourseStatsSchema
);
