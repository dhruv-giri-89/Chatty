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

      // ---------------- Get Friends ----------------
      getFriends: async () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        set({ friendsLoading: true });
        try {
          const res = await axiosInstance.get("/friendships");
          set({ friends: res.data.friends, friendsLoading: false });
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

      // ---------------- Accept Friend Request ----------------
      acceptFriendRequest: async (friendshipId) => {
        try {
          await axiosInstance.patch(`/friendship/${friendshipId}`, {
            status: "accepted",
          });
          toast.success("Friend request accepted");
          get().getFriends();
          get().getFriendRequests();
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
        } catch (error) {
          console.error("Error deleting request:", error);
          toast.error("Failed to delete request");
        }
      },
    }),
    {
      name: "friend-store",
      partialize: (state) => ({
        friends: state.friends,
      }),
    }
  )
);
