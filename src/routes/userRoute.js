import { Router } from "express";

import verifyToken from "../middleware/verifyToken.js";

import { updateUser } from "../controllers/userController.js";

const router = Router();

router.patch("/:id", verifyToken, updateUser);

export default router;
