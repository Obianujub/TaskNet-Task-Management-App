import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: "ongoing",
      enum: ["ongoing", "completed"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
