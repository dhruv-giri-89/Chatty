import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "./useChatStore";

const useGroupChatStore = create((set, get) => ({
  groups: [],
  groupsLoading: false,
  groupClicked: null,

  // ========= Set clicked group and reset user chat if needed =========
  setGroupClicked: (group) => {
    if (group) useChatStore.getState().setUserClicked(null);
    set({ groupClicked: group });
  },

  // ========= Fetch groups (initial load only) =========
  getGroups: async () => {
    set({ groupsLoading: true });
    try {
      const res = await axiosInstance.get("/message/usergroups");
      set({
        groups: Array.isArray(res.data) ? res.data : [],
        groupsLoading: false,
      });
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load groups");
    } finally {
      set({ groupsLoading: false });
    }
  },

  // ========= Create a new group =========
  createGroup: async ({ groupName, groupDescription, members }) => {
    try {
      const res = await axiosInstance.post("/message/creategroup", {
        groupName,
        groupDescription,
        members,
      });

      const newGroup = res.data;

      set((state) => ({
        groups: [newGroup, ...state.groups],
      }));

      toast.success("Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    }
  },

  // ========= Update Group Avatar =========
  updateGroupPic: async ({ groupId, imageBase64 }) => {
    try {
      const res = await axiosInstance.patch(
        `/message/group/${groupId}/avatar`,
        {
          image: imageBase64,
        }
      );

      const updatedGroup = res.data.group;

      set((state) => ({
        groups: state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        ),
        groupClicked:
          state.groupClicked?._id === updatedGroup._id
            ? updatedGroup
            : state.groupClicked,
      }));

      toast.success("Group picture updated!");
    } catch (error) {
      console.error("Error updating group picture:", error);
      toast.error("Failed to update group picture");
    }
  },

  // ========= Update Group Name =========
  updateGroupName: async ({ groupId, newName }) => {
    try {
      const res = await axiosInstance.patch(`/message/group/${groupId}/name`, {
        newName,
      });

      const updatedGroup = res.data.group;

      set((state) => ({
        groups: state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        ),
        groupClicked:
          state.groupClicked?._id === updatedGroup._id
            ? updatedGroup
            : state.groupClicked,
      }));

      toast.success("Group name updated!");
    } catch (error) {
      console.error("Error updating group name:", error);
      toast.error("Failed to update group name");
    }
  },

  // ========= Update Group Description =========
  updateGroupDescription: async ({ groupId, newDescription }) => {
    try {
      const res = await axiosInstance.patch(
        `/message/group/${groupId}/description`,
        {
          newDescription,
        }
      );

      const updatedGroup = res.data.group;

      set((state) => ({
        groups: state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        ),
        groupClicked:
          state.groupClicked?._id === updatedGroup._id
            ? updatedGroup
            : state.groupClicked,
      }));

      toast.success("Group description updated!");
    } catch (error) {
      console.error("Error updating group description:", error);
      toast.error("Failed to update group description");
    }
  },

  // ========= Remove Group Members =========
  removeGroupMembers: async ({ groupId, memberIds }) => {
    try {
      const res = await axiosInstance.patch(
        `/message/group/${groupId}/remove-members`,
        { memberIds }
      );

      const updatedGroup = res.data.group;

      set((state) => ({
        groups: state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        ),
        groupClicked:
          state.groupClicked?._id === updatedGroup._id
            ? updatedGroup
            : state.groupClicked,
      }));

      toast.success("Members removed successfully");
    } catch (error) {
      console.error("Error removing group members:", error);
      toast.error("Failed to remove members");
    }
  },

  // ========= Add Members to Group =========
  addGroupMembers: async ({ groupId, memberIds }) => {
    try {
      const res = await axiosInstance.patch(
        `/message/group/${groupId}/add-members`,
        { memberIds }
      );

      const updatedGroup = res.data.group;

      set((state) => ({
        groups: state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        ),
        groupClicked:
          state.groupClicked?._id === updatedGroup._id
            ? updatedGroup
            : state.groupClicked,
      }));

      toast.success("Members added successfully");
    } catch (error) {
      console.error("Error adding group members:", error);
      toast.error("Failed to add members");
    }
  },
  // ========= Change Group Admin =========
  changeGroupAdmin: async ({ groupId, newAdminId }) => {
    try {
      const res = await axiosInstance.patch(
        `/message/group/${groupId}/change-admin`,
        { newAdminId }
      );

      const updatedGroup = res.data.group;

      set((state) => ({
        groups: state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        ),
        groupClicked:
          state.groupClicked?._id === updatedGroup._id
            ? updatedGroup
            : state.groupClicked,
      }));

      toast.success("Group admin changed successfully");
    } catch (error) {
      console.error("Error changing group admin:", error);
      toast.error("Failed to change group admin");
    }
  },
  // ========= Remove Group for Current User =========
  removeGroupForCurrentUser: async (groupId) => {
    try {
      const res = await axiosInstance.delete(`/message/removegroup/${groupId}`);

      const updatedGroupIds = res.data.updatedGroups;

      set((state) => ({
        groups: state.groups.filter((g) => g._id !== groupId),
        groupClicked:
          state.groupClicked?._id === groupId ? null : state.groupClicked,
      }));

      toast.success("Group removed successfully");
    } catch (error) {
      console.error("Error removing group for user:", error);
      toast.error("Failed to remove group");
    }
  },
}));

export default useGroupChatStore;
