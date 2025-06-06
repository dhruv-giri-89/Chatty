import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const register = async (req, res) => {
  const { email, fullname, password, profilepic } = req.body;

  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullname,
      password: hashedPassword,
      profilepic,
    });
    if (!newUser) {
      return res.status(400).json({ message: "User registration failed" });
    }
    await newUser.save();
    generateToken(newUser._id, res);
    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);

    const {
      _id,
      email: userEmail,
      fullname,
      profilepic,
      createdAt,
      updatedAt,
    } = user;
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id,
        email: userEmail,
        fullname,
        profilepic,
        createdAt,
        updatedAt,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfilepic = async (req, res) => {
  try {
    const { profilepic } = req.body;
    const userID = req.user._id;
    if (!profilepic) {
      return res
        .status(400)
        .json({ message: "Profile picture URL is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilepic);
    const updateUser = await User.findByIdAndUpdate(
      userID,
      { profilepic: uploadResponse.secure_url },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: {
        email: updateUser.email,
        fullname: updateUser.fullname,
        profilepic: updateUser.profilepic,
      },
    });
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Error checking user:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
