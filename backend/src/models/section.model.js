import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual to populate lectures
sectionSchema.virtual("lectures", {
  ref: "Lecture",
  localField: "_id",
  foreignField: "section"
});

export const Section = mongoose.model("Section", sectionSchema);
