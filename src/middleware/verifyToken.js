import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }

  try {
    const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id, username };
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
};
