import mongoose from "mongoose";

const trendingCoursesSchema = new mongoose.Schema(
  {
    // Reference to source course
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true,
      index: true
    },

    // Denormalized fields for fast reads
    title: {
      type: String,
      required: true,
      trim: true
    },

    thumbnail: {
      type: String,
      required: true
    },

    instructorName: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      index: true
    },

    level: {
      type: String,
      index: true
    },

    language: {
      type: String,
      index: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    // Popularity signals (rolling window)
    enrollmentsLast7Days: {
      type: Number,
      default: 0,
      min: 0
    },

    enrollmentsLast30Days: {
      type: Number,
      default: 0,
      min: 0
    },

    viewsLast7Days: {
      type: Number,
      default: 0,
      min: 0
    },

    // Quality signals
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

    // Trending score (computed)
    trendingScore: {
      type: Number,
      default: 0,
      index: true
    },

    // Publication state snapshot
    isPublished: {
      type: Boolean,
      default: true,
      index: true
    },

    publishedAt: {
      type: Date,
      index: true
    },

    // Freshness tracking
    lastCalculatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const TrendingCourses = mongoose.model(
  "TrendingCourses",
  trendingCoursesSchema
);
