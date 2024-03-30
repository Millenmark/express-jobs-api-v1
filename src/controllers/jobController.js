import mongoose from "mongoose";

/** IMPORT: MODEL */
import Job from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  const {
    user: { _id: userId },
    query: { search, status, jobType, sort, page, limit },
  } = req;

  const pageInt = parseInt(page) || 1;
  const limitInt = parseInt(limit) || 10;
  const skip = (page - 1) * limit;

  const queryObject = {
    createdBy: userId,
  };

  if (search) queryObject.position = { $regex: search, $options: "i" };
  if (status && status !== "all") queryObject.status = status;
  if (jobType && jobType !== "all") queryObject.jobType = jobType;

  let result = Job.find(queryObject).skip(skip).limit(limit);

  if (sort === "latest") result.sort("-createdAt");
  if (sort === "oldest") result.sort("createdAt");
  if (sort === "a-z") result.sort("position");
  if (sort === "z-a") result.sort("-position");

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(200).json({ jobs, totalJobs, numOfPages });
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
