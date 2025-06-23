import { Response } from "express";
import { CustomRequest } from "../types/authTypes";
import { AddTaskBody } from "../types/taskTypes";
import Task from "../models/taskModel";

export const addTask = async (
  req: CustomRequest<{}, {}, AddTaskBody>,
  res: Response
) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "All fields required" });
    }
    await Task.create({
      title,
      description,
      userId: req.userId,
    });
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTasks = async (req: CustomRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(201).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: CustomRequest, res: Response) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { state: "Completed" });
    res.status(201).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: CustomRequest, res: Response) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(201).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
