import { Router } from "express";
/** IMPORT: CONTROLLER */
import { login, register } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
