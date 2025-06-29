import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    groupName: {
      type: String,
      required: true,
    },

    groupDescription: {
      type: String,
    },

    groupProfilePicture: {
      type: String,
      default: "/assets/defaultPhoto.png", // or a public URL if you serve static files
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);
export default Group;
