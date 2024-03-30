import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "",
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "",
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "",
  },
  fullName: {
    type: String,
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "",
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
    dropDups: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ! fullName must not be required if you want to populate it before saving
UserSchema.pre("save", function (next) {
  const { firstName, middleName, lastName } = this;
  this.fullName = `${firstName} ${middleName} ${lastName}`;
  next();
});

UserSchema.pre("findOneAndUpdate", function (next) {
  // Check if any of the name fields have been modified
  if (
    this._update.firstName ||
    this._update.middleName ||
    this._update.lastName
  ) {
    // Populate fullName based on updated values
    this._update.fullName = `${this._update.firstName || this._doc.firstName} ${
      this._update.middleName || this._doc.middleName
    } ${this._update.lastName || this._doc.lastName}`;
  }
  next();
});

UserSchema.methods.accessToken = function () {
  return jwt.sign(
    { userId: this._id, fullName: this.fullName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
