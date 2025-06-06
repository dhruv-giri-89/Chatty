import User from "../models/user.model.js";
import Message from "../models/mesage.model.js";
import cloudinary from "../lib/cloudinary.js";
export const sideUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }, "-password");
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({ message: "Internal server error" });
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
    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
