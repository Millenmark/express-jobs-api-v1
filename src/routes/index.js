import { Router } from "express";
import authRoute from "./authRoute.js";
import jobRoute from "./jobRoute.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/jobs", jobRoute);

export default router;
