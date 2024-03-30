/** IMPORT: MODEL */
import User from "../models/User.js";

export const register = async (req, res) => {
  const { firstName, middleName, lastName, location, email, password } =
    req.body;

  if (
    !firstName ||
    !middleName ||
    !lastName ||
    !location ||
    !email ||
    !password
  )
    return res.status(400).json({ message: "All fields are required" });

  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email is already been used" });

  const user = await User.create({
    firstName,
    middleName,
    lastName,
    location,
    email,
    password,
  });

  res.status(201).json({
    message: "User registered successfully",
    user,
    token: user.accessToken(),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid Credentials" });

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch)
    return res.status(400).json({ message: "Invalid Credentials" });

  res
    .status(200)
    .json({ message: "Login Successful", token: user.accessToken() });
};
