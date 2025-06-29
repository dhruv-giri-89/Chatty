import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client"; // Added missing import

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      socket: null,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      isSigningup: false,
      isLoggingIn: false,
      hasHydrated: false,
      onlineUsers: [],

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
          const user = res.data.user || res.data;
          set({ authUser: user, isCheckingAuth: false });
          get().connectSocket();
        } catch (error) {
          console.error("Error checking authentication:", error);
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data) => {
        set({ isSigningup: true });
        try {
          const res = await axiosInstance.post("/auth/register", data);
          const user = res.data.user || res.data;
          set({ authUser: user });
          toast.success("Signup successful");
          get().connectSocket();
          return user;
        } catch (error) {
          console.error("Error during signup:", error);
          throw error.response?.data || new Error("Signup failed");
        } finally {
          set({ isSigningup: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          const user = res.data.user || res.data;
          set({ authUser: user });
          toast.success("Login successful");
          get().connectSocket();
          return user;
        } catch (error) {
          toast.error("Invalid credentials");
          console.error("Error during login:", error);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket();
        } catch (error) {
          toast.error("Error logging out");
          console.error("Error during logout:", error);
        }
      },

      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profilepic", data);
          const user = res.data.user || res.data;
          set({ authUser: user });
          toast.success("Profile updated successfully");
          return user;
        } catch (error) {
          console.error("Error updating profile:", error);
          toast.error("Failed to update profile");
          throw error.response?.data || new Error("Profile update failed");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser) {
          console.warn("Cannot connect socket, no user authenticated");
          return;
        }
        if (socket?.connected) {
          console.warn("Socket already connected");
          return;
        }
        const newSocket = io(BASE_URL, {
          auth: { token: authUser.token },
          query: { userId: authUser._id },
        });
        set({ socket: newSocket });

        newSocket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },

      disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ authUser: state.authUser }),
      onRehydrateStorage: () => (state) => {
        state.hasHydrated = true;
      },
    }
  )
);
