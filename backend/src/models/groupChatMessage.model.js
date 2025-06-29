import mongoose from "mongoose";

const GroupMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const GroupMessages = mongoose.model("GroupMessages", GroupMessageSchema);
export default GroupMessages;
