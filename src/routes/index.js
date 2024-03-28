import { Router } from "express";
import authRoute from "./authRoute.js";
import jobRoute from "./jobRoute.js";

/** IMPORT: MIDDLEWARE */
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/jobs", jobRoute);

export default router;
