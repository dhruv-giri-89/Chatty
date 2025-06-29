import mongoose from "mongoose";

const FriendshipSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Removed the unique index enforcing unique user1-user2 pairs
// FriendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Friendship = mongoose.model("Friendship", FriendshipSchema);
export default Friendship;
