import { create } from "zustand";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  userClicked: null,
  messagesLoading: false,
  usersLoading: false,

  setUserClicked: (user) => set({ userClicked: user }),
  setMessages: (messages) => set({ messages }),
  getUsers: async () => {
    set({ usersLoading: true });
    try {
      const res = await axiosInstance.get("message/users");
      console.log("Fetched users:", res.data);
      set({ users: res.data, usersLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      set({ usersLoading: false });
    } finally {
      set({ usersLoading: false });
    }
  },
  getMessages: async (id) => {
    set({ messagesLoading: true });
    try {
      const res = await axiosInstance.get(`message/usermessages/${id}`);
      set({
        messages: Array.isArray(res.data) ? res.data : [],
        messagesLoading: false,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      set({ messagesLoading: false });
    } finally {
      set({ messagesLoading: false });
    }
  },
  sendMessage: async ({ recipientId, text, image }) => {
    if (!recipientId || (!text && !image)) {
      toast.error("Recipient and at least text or image required");
      return;
    }
    set({ messagesLoading: true });
    try {
      const res = await axiosInstance.post(
        `message/sendmessage/${recipientId}`,
        {
          text,
          image,
        }
      );
      set((state) => ({
        messages: [...state.messages, res.data],
      }));
      console.log("Message sent:", res.data);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      set({ messagesLoading: false });
    }
  },
}));
