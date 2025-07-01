import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// Get all notifications for the current user (where user2 is the current user)
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      user2: userId,
      status: "unread"
    })
      .populate("user1", "-password") // Show the user who triggered the notification
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications." });
  }
};

// Get notification count for the current user
export const getNotificationCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      user2: userId,
      status: "unread"
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    res.status(500).json({ message: "Error fetching notification count." });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // Only allow update if the user is the recipient (user2)
    if (notification.user2.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this notification." });
    }

    notification.status = "read";
    await notification.save();

    res.status(200).json({ message: "Notification marked as read.", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error updating notification." });
  }
};

// Mark all notifications as read for the current user
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { user2: userId, status: "unread" },
      { status: "read" }
    );

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Error updating notifications." });
  }
};

// Create a notification (helper function for other controllers)
export const createNotification = async (user1Id, user2Id) => {
  try {
    const notification = await Notification.create({
      user1: user1Id,
      user2: user2Id,
      status: "unread"
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}; 