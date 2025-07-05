import Group from "../models/groupChat.model.js";
import GroupMessages from "../models/groupChatMessage.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import User from "../models/user.model.js";

export const getGroupById = async (req, res) => {
  try {
    const { id: groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("admin", "username avatar")
      .populate("members", "username avatar");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching group:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const groupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;

    const messages = await GroupMessages.find({ receiverGroup: groupId })
      .populate("sender", "fullname profilepic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching group messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a message to a group
export const sendGroupMessage = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const senderId = req.user._id;
    const { text, image } = req.body;

    const group = await Group.findById(groupId);
    if (!group || !group.members.includes(senderId)) {
      return res.status(403).json({ message: "Not authorized in this group" });
    }

    let imageUrl = "";
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image);
      imageUrl = uploadResult.secure_url;
    }

    const newMessage = await GroupMessages.create({
      sender: senderId,
      receiverGroup: groupId,
      text,
      image: imageUrl,
    });

    // Populate sender for real-time and response
    const populatedMessage = await GroupMessages.findById(newMessage._id).populate("sender", "fullname profilepic");

    group.members.forEach((memberId) => {
      if (memberId.toString() !== senderId.toString()) {
        const socketId = getReceiverSocketId(memberId.toString());
        if (socketId) {
          io.to(socketId).emit("newGroupMessage", populatedMessage);
        }
      }
    });

    res.status(200).json(populatedMessage);
  } catch (error) {
    console.error("Error sending group message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { groupName, groupDescription, members } = req.body;
    const adminId = req.user._id;

    // Create group with admin and members
    const allMembers = [...new Set([...members, adminId.toString()])];

    const group = await Group.create({
      admin: adminId,
      groupName,
      groupDescription,
      members: allMembers,
    });

    // Update each user to add this group ID to their groups list
    await User.updateMany(
      { _id: { $in: allMembers } },
      { $addToSet: { groups: group._id } } // prevents duplicates
    );

    // Return the populated group
    const populatedGroup = await Group.findById(group._id)
      .populate("admin", "fullname profilepic")
      .populate("members", "fullname profilepic");

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Error creating group:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeGroupFromUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { groupId } = req.params;

    // 1. Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // 2. Remove user from group.members
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );
    await group.save();

    // 3. Remove group from user's groups
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.groups = user.groups.filter(
      (id) => id.toString() !== groupId.toString()
    );
    await user.save();

    res.status(200).json({
      message: "User removed from group successfully",
      updatedGroups: user.groups,
    });
  } catch (error) {
    console.error("Error removing user from group:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateGroupAvatar = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only admin can update the group picture
    if (group.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the admin can update group picture" });
    }

    // Upload new image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "group_avatars",
    });

    // Update group profile picture
    group.groupProfilePicture = uploadResult.secure_url;
    await group.save();

    // Re-fetch fully populated group
    const updatedGroup = await Group.findById(groupId)
      .populate("admin") // full admin object
      .populate("members"); // full member objects

    res.status(200).json({
      message: "Group picture updated successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Error updating group avatar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const populateGroup = async (groupId) => {
  return Group.findById(groupId)
    .populate("admin", "fullname profilepic email")
    .populate("members", "fullname profilepic email");
};

// ========== Update Group Name ==========
export const updateGroupName = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newName } = req.body;
    const userId = req.user._id;

    if (!newName)
      return res.status(400).json({ message: "Group name is required" });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only admin can update group name" });
    }

    group.groupName = newName;
    await group.save();

    const updatedGroup = await populateGroup(groupId);
    res
      .status(200)
      .json({ message: "Group name updated", group: updatedGroup });
  } catch (error) {
    console.error("Error updating group name:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ========== Update Group Description ==========
export const updateGroupDescription = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newDescription } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only admin can update group description" });
    }

    group.groupDescription = newDescription || "";
    await group.save();

    const updatedGroup = await populateGroup(groupId);
    res
      .status(200)
      .json({ message: "Group description updated", group: updatedGroup });
  } catch (error) {
    console.error("Error updating group description:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ========== Delete Group Members ==========
export const removeMembersFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberIds } = req.body; // array of user IDs to remove
    const userId = req.user._id;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "memberIds must be a non-empty array" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the admin can remove members" });
    }

    // Remove members from group
    group.members = group.members.filter(
      (memberId) => !memberIds.includes(memberId.toString())
    );
    await group.save();

    // Remove group from each user's groups list
    await User.updateMany(
      { _id: { $in: memberIds } },
      { $pull: { groups: groupId } }
    );

    const updatedGroup = await populateGroup(groupId);

    res.status(200).json({
      message: "Members removed successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Error removing members:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// ========== Add Group Members ==========
export const addMembersToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberIds } = req.body; // array of user IDs to add
    const userId = req.user._id;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "memberIds must be a non-empty array" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the admin can add members" });
    }

    // Add members to group (prevent duplicates)
    const uniqueNewMembers = memberIds.filter(
      (id) => !group.members.includes(id)
    );
    group.members.push(...uniqueNewMembers);
    await group.save();

    // Add group to each user's groups list
    await User.updateMany(
      { _id: { $in: uniqueNewMembers } },
      { $addToSet: { groups: groupId } } // addToSet avoids duplicates
    );

    const updatedGroup = await populateGroup(groupId);

    res.status(200).json({
      message: "Members added successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Error adding members:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// ========== Change Group Admin ==========
export const changeGroupAdmin = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newAdminId } = req.body;
    const currentUserId = req.user._id;

    if (!newAdminId) {
      return res.status(400).json({ message: "New admin ID is required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if current user is the current admin
    if (group.admin.toString() !== currentUserId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the current admin can transfer admin rights" });
    }

    // Check if the new admin is a member of the group
    const isMember = group.members.some(
      (memberId) => memberId.toString() === newAdminId.toString()
    );

    if (!isMember) {
      return res.status(400).json({
        message: "The new admin must be a member of the group",
      });
    }

    // Update the group's admin
    group.admin = newAdminId;
    await group.save();

    const updatedGroup = await populateGroup(groupId);

    res.status(200).json({
      message: "Group admin updated successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Error changing group admin:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
