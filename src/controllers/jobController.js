import mongoose from "mongoose";

/** IMPORT: MODEL */
import Job from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({}).sort("createdAt");
  res.status(200).json({ jobs });
};

export const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req; // Nested destructuring

  if (!mongoose.Types.ObjectId.isValid(jobId))
    return res.status(400).json({ message: "Invalid job ID" });

  const job = await Job.findById(jobId);

  if (!job) return res.status(404).json({ message: "Not Found" });

  res.status(200).json({ job });
};

export const createJob = async (req, res) => {
  const { company, position, status } = req.body;
  const { _id: userId } = req.user;
  await Job.create({ company, position, status, createdBy: userId });
  res.status(201).json({ message: "Job created successfully" });
};

export const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position, status },
  } = req;

  if (!mongoose.Types.ObjectId.isValid(jobId))
    return res.status(400).json({ message: "Invalid job ID" });

  if (company === "" || position === "")
    return res
      .status(400)
      .json({ message: "Company and Position are required" });

  const job = await Job.findByIdAndUpdate(
    jobId,
    { company, position, status },
    { new: true, runValidators: true }
  );

  if (!job) return res.status(404).json({ message: "Not Found" });

  res.status(200).json({ message: "Job Update Successfully" });
};

export const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId))
    return res.status(400).json({ message: "Invalid job ID" });

  await Job.findByIdAndDelete(jobId);

  res.status(200).json({ message: "Job Deleted Successfully" });
};
