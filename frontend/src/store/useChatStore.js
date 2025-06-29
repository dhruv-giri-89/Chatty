import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import useGroupChatStore from "./useGroupChatStore";
export const useChatStore = create(
  persist(
    (set, get) => ({
      // ---------------- State ----------------
      messages: [],
      users: [],
      userClicked: null,
      messagesLoading: false,
      usersLoading: false,

      // ---------------- User Chat Functions ----------------
      setUserClicked: (user) => {
        if (user) useGroupChatStore.getState().setGroupClicked(null);
        set({ userClicked: user });
      },
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
            { text, image }
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

      subMessage: () => {
        const { userClicked } = get();
        if (!userClicked) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
          if (newMessage.sender !== userClicked._id) return;
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
        });
      },

      unsubMessage: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
          socket.off("newMessage");
        }
      },
    }),
    {
      name: "chat-store", // localStorage key
      partialize: (state) => ({
        messages: state.messages,
      }),
    }
  )
);
