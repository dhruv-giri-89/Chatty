import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useFriendStore = create(
  persist(
    (set, get) => ({
      // ---------------- State ----------------
      friends: [],
      friendsLoading: false,
      friendRequests: [],
      requestsLoading: false,
      pendingRequests: [], // Track pending outgoing requests
      outgoingRequests: [], // Track outgoing requests from server
      outgoingRequestsLoading: false,
      notifications: [],
      notificationsLoading: false,
      notificationCount: 0,
      friendRequestCount: 0,

      // ---------------- Get Friends ----------------
      getFriends: async () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        set({ friendsLoading: true });
        try {
          const res = await axiosInstance.get("/friendships");
          const newFriends = res.data.friends;
          
          // Remove users from pending requests if they are now friends
          const { pendingRequests } = get();
          const friendIds = newFriends.map(friend => friend._id || friend.id);
          const updatedPendingRequests = pendingRequests.filter(userId => !friendIds.includes(userId));
          
          set({ 
            friends: newFriends, 
            friendsLoading: false,
            pendingRequests: updatedPendingRequests
          });
        } catch (error) {
          console.error("Error fetching friends:", error);
          toast.error("Failed to load friends");
          set({ friendsLoading: false });
        }
      },

      // ---------------- Get Inbox (Incoming Requests) ----------------
      getFriendRequests: async () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        set({ requestsLoading: true });
        try {
          const res = await axiosInstance.get("/inbox");
          set({ friendRequests: res.data.inbox, requestsLoading: false });
        } catch (error) {
          console.error("Error fetching friend requests:", error);
          toast.error("Failed to load friend requests");
          set({ requestsLoading: false });
        }
      },

      // ---------------- Get Notifications ----------------
      getNotifications: async () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        set({ notificationsLoading: true });
        try {
          const res = await axiosInstance.get("/notifications");
          set({ notifications: res.data.notifications, notificationsLoading: false });
        } catch (error) {
          console.error("Error fetching notifications:", error);
          toast.error("Failed to load notifications");
          set({ notificationsLoading: false });
        }
      },

      // ---------------- Get Notification Count ----------------
      getNotificationCount: async () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        try {
          const res = await axiosInstance.get("/notifications/count");
          set({ notificationCount: res.data.count });
        } catch (error) {
          console.error("Error fetching notification count:", error);
        }
      },

      // ---------------- Get Friend Request Count ----------------
      getFriendRequestCount: async () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        try {
          const res = await axiosInstance.get("/request-count");
          set({ friendRequestCount: res.data.count });
        } catch (error) {
          console.error("Error fetching friend request count:", error);
        }
      },

      // ---------------- Mark Notification as Read ----------------
      markNotificationAsRead: async (notificationId) => {
        try {
          await axiosInstance.patch(`/notifications/${notificationId}/read`);
          // Remove the notification from the list
          const { notifications } = get();
          set({ 
            notifications: notifications.filter(notif => notif._id !== notificationId) 
          });
        } catch (error) {
          console.error("Error marking notification as read:", error);
          toast.error("Failed to mark notification as read");
        }
      },

      // ---------------- Mark All Notifications as Read ----------------
      markAllNotificationsAsRead: async () => {
        try {
          await axiosInstance.patch("/notifications/mark-all-read");
          set({ notifications: [] });
          toast.success("All notifications marked as read");
        } catch (error) {
          console.error("Error marking all notifications as read:", error);
          toast.error("Failed to mark all notifications as read");
        }
      },

      // ---------------- Get Outgoing Requests ----------------
      getOutgoingRequests: async () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        set({ outgoingRequestsLoading: true });
        try {
          const res = await axiosInstance.get("/outgoing");
          const outgoingRequests = res.data.outgoingRequests;
          
          // Extract user IDs from outgoing requests to sync with pendingRequests
          const outgoingUserIds = outgoingRequests.map(request => 
            request.user2._id || request.user2.id
          );
          
          set({ 
            outgoingRequests, 
            outgoingRequestsLoading: false,
            pendingRequests: outgoingUserIds // Sync with server data
          });
        } catch (error) {
          console.error("Error fetching outgoing requests:", error);
          toast.error("Failed to load outgoing requests");
          set({ outgoingRequestsLoading: false });
        }
      },

      // ---------------- Send Friend Request ----------------
      sendFriendRequest: async (userId) => {
        const { pendingRequests } = get();
        
        // Check if request is already pending
        if (pendingRequests.includes(userId)) {
          toast.error("Friend request already sent");
          return;
        }

        try {
          // Add to pending requests immediately
          set({ pendingRequests: [...pendingRequests, userId] });
          
          await axiosInstance.post("/friendship", { userId });
          toast.success("Friend request sent successfully");
          
          // Refresh outgoing requests to sync with server
          get().getOutgoingRequests();
        } catch (error) {
          console.error("Error sending friend request:", error);
          // Remove from pending requests on error
          set({ pendingRequests: pendingRequests.filter(id => id !== userId) });
          
          if (error.response?.status === 400) {
            toast.error(error.response.data.message || "Invalid user ID");
          } else {
            toast.error("Failed to send friend request");
          }
        }
      },

      // ---------------- Accept Friend Request ----------------
      acceptFriendRequest: async (friendshipId) => {
        try {
          await axiosInstance.patch(`/friendship/${friendshipId}`, {
            status: "accepted",
          });
          toast.success("Friend request accepted");
          get().getFriends();
          get().getFriendRequests();
          get().getOutgoingRequests();
        } catch (error) {
          console.error("Error accepting request:", error);
          toast.error("Failed to accept request");
        }
      },

      // ---------------- Reject/Delete Friend Request ----------------
      deleteFriendRequest: async (friendshipId) => {
        try {
          await axiosInstance.delete(`/friendship/${friendshipId}`);
          toast.success("Friend request deleted");
          get().getFriendRequests();
          get().getOutgoingRequests();
        } catch (error) {
          console.error("Error deleting request:", error);
          toast.error("Failed to delete request");
        }
      },

      // ---------------- Check if request is pending ----------------
      isRequestPending: (userId) => {
        const { pendingRequests } = get();
        return pendingRequests.includes(userId);
      },

      // ---------------- Remove from pending requests (when accepted/rejected) ----------------
      removePendingRequest: (userId) => {
        const { pendingRequests } = get();
        set({ pendingRequests: pendingRequests.filter(id => id !== userId) });
      },

      // ---------------- Remove Friend ----------------
      removeFriend: async (userId) => {
        try {
          await axiosInstance.delete(`/friend/${userId}`);
          toast.success("Friend removed successfully");
          
          // Refresh friends list and outgoing requests
          get().getFriends();
          get().getOutgoingRequests();
        } catch (error) {
          console.error("Error removing friend:", error);
          toast.error("Failed to remove friend");
        }
      },

      // ---------------- Refresh Inbox Data (for real-time updates) ----------------
      refreshInboxData: () => {
        get().getFriendRequests();
        get().getNotifications();
        get().getNotificationCount();
        get().getFriendRequestCount();
      },

      // ---------------- Initialize store data ----------------
      initializeStore: async () => {
        await Promise.all([
          get().getFriends(),
          get().getFriendRequests(),
          get().getOutgoingRequests(),
          get().getNotifications(),
          get().getNotificationCount(),
          get().getFriendRequestCount()
        ]);
      },
    }),
    {
      name: "friend-store",
      partialize: (state) => ({
        friends: state.friends,
        pendingRequests: state.pendingRequests, // Persist pending requests
      }),
    }
  )
);
