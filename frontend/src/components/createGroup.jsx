// src/components/CreateGroup.jsx
import React, { useState } from "react";
import useGroupChatStore from "../store/useGroupChatStore";
import { useChatStore } from "../store/useChatStore";
import defaultPhoto from "../assets/photo.png";

const CreateGroup = ({ isOpen, onClose }) => {
  const { users } = useChatStore();
  const { createGroup } = useGroupChatStore();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  if (!isOpen) return null;

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      return toast.error("Group name is required");
    }

    try {
      await createGroup({
        groupName,
        groupDescription,
        members: selectedUsers,
      });

      // Clear fields and close modal
      setGroupName("");
      setGroupDescription("");
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Group creation failed:", error);
    }
  };

  return (
    <>
      {/* Blurry Background */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-lg relative"
          onClick={(e) => e.stopPropagation()} // Prevent modal close on inside click
        >
          <h2 className="text-xl font-semibold text-base-content mb-4">
            Create Group
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-base-content mb-1">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-base-content mb-1">
                Description
              </label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Enter group description"
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-base-content mb-2">
                Select Users
              </label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {users.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                    />
                    <img
                      src={user.profilepic || defaultPhoto}
                      alt={user.fullname}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span>{user.fullname}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateGroup;
