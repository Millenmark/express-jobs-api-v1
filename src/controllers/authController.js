import jwt from "jsonwebtoken";

/** IMPORT: MODEL */
import User from "../models/User.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email is already been used" });

  const user = await User.create({ name, email, password });

  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.status(201).json({
    message: "User registered successfully",
    user: { name: user.getName() },
    token,
  });
};

export const login = async (req, res) => {
  res.send("Login Route");
};
