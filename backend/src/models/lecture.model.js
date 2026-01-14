import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    duration: {
      type: Number // seconds
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
