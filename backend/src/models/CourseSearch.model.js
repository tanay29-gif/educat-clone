import mongoose from "mongoose";

const courseSearchSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId,
     ref: "Course", 
     unique: true },
  title: String,
  description: String,
  instructorName: String,
  tags: [String],
  category: String,
  price: Number,
  language: String,
  level: String,
  publishedAt: Date
});

courseSearchSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  instructorName: "text"
});

export const CourseSearch = mongoose.model("CourseSearch", courseSearchSchema);
