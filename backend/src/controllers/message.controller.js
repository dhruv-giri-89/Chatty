import User from "../models/user.model.js";
import Group from "../models/groupChat.model.js";
import Message from "../models/mesage.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const sideUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }, "-password");
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sideGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "groups",
      populate: [
        {
          path: "admin",
          select: "-password -__v", // exclude sensitive fields
        },
        {
          path: "members",
          select: "-password -__v",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.groups); // return full group info
  } catch (error) {
    console.error("Error fetching user groups:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userMessages = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching user messages:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { id: userId } = req.params;
  const myId = req.user._id;
  const { text, image } = req.body;
  try {
    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      sender: myId,
      receiver: userId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSockedId = getReceiverSocketId(userId);
    if (receiverSockedId) {
      io.to(receiverSockedId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
