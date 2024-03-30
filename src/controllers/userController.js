import User from "../models/User.js";

export const updateUser = async (req, res) => {
  const {
    params: { id: userId },
    body: { email, firstName, middleName, lastName, location },
  } = req;

  if (!email || !firstName || !middleName || !lastName || !location)
    return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ email });

  if (user && user._id.toString() !== userId)
    return res.status(400).json({ message: "Email is already been used" });

  await User.findByIdAndUpdate(
    userId,
    {
      email,
      firstName,
      middleName,
      lastName,
      location,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ message: "User Updated Successfully" });
};
