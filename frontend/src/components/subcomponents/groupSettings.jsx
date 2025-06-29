import React, { useRef, useState } from "react";
import useGroupChatStore from "../../store/useGroupChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";

const GroupSettings = ({ group, onClose }) => {
  const fileInputRef = useRef();
  const {
    updateGroupPic,
    updateGroupName,
    updateGroupDescription,
    addGroupMembers,
    removeGroupMembers,
    changeGroupAdmin,
    removeGroupForCurrentUser,
  } = useGroupChatStore();

  const { users } = useChatStore();
  const { authUser } = useAuthStore();
  const isAdmin = authUser?._id === group.admin?._id;

  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newName, setNewName] = useState(group.groupName);
  const [newDescription, setNewDescription] = useState(
    group.groupDescription || ""
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState([]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedNewAdmin, setSelectedNewAdmin] = useState("");

  const triggerFileSelect = () => isAdmin && fileInputRef.current?.click();

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !isAdmin) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateGroupPic({ groupId: group._id, imageBase64: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleNameSave = () => {
    if (newName.trim() && newName !== group.groupName) {
      updateGroupName({ groupId: group._id, newName });
    }
    setEditingName(false);
  };

  const handleDescriptionSave = () => {
    if (newDescription !== group.groupDescription) {
      updateGroupDescription({ groupId: group._id, newDescription });
    }
    setEditingDescription(false);
  };

  const handleRemoveMember = (memberId) => {
    if (memberId === group.admin?._id) return;
    removeGroupMembers({ groupId: group._id, memberIds: [memberId] });
  };

  const toggleSelectToAdd = (id) => {
    setSelectedToAdd((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleAddMembers = () => {
    if (selectedToAdd.length === 0) return;
    addGroupMembers({ groupId: group._id, memberIds: selectedToAdd });
    setShowAddModal(false);
    setSelectedToAdd([]);
  };

  const handleDeleteGroup = async () => {
    try {
      if (isAdmin) {
        if (!selectedNewAdmin) {
          toast.error("Please select a new admin before deleting group.");
          return;
        }

        await changeGroupAdmin({
          groupId: group._id,
          newAdminId: selectedNewAdmin,
        });
      }

      await removeGroupForCurrentUser(group._id);
      onClose();
    } catch (err) {
      toast.error("Failed to delete or transfer group.");
    }
  };

  const availableUsers = users.filter(
    (u) => !group.members?.some((m) => m._id === u._id)
  );

  const membersToSelectAdmin = group.members?.filter(
    (m) => m._id !== group.admin?._id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/60"
        onClick={onClose}
      ></div>

      <div className="relative bg-[#1e293b] text-white w-full max-w-md max-h-[90vh] rounded-xl shadow-lg p-6 z-50 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Group Settings</h2>

        {/* Avatar */}
        <div className="flex items-center mb-4 gap-4">
          {group.groupProfilePicture ? (
            <img
              src={group.groupProfilePicture}
              alt="Group"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              {group.groupName?.charAt(0).toUpperCase() || "G"}
            </div>
          )}
          {isAdmin && (
            <>
              <button
                onClick={triggerFileSelect}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm"
              >
                Change
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* Group Name */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Group Name</label>
          {editingName ? (
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 bg-gray-800 text-white px-2 py-1 rounded"
              />
              <button
                onClick={handleNameSave}
                className="bg-green-600 px-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p>{group.groupName}</p>
              {isAdmin && (
                <button
                  onClick={() => setEditingName(true)}
                  className="text-blue-400 text-sm hover:underline"
                >
                  Change
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Description
          </label>
          {editingDescription ? (
            <div className="flex gap-2">
              <input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="flex-1 bg-gray-800 text-white px-2 py-1 rounded"
              />
              <button
                onClick={handleDescriptionSave}
                className="bg-green-600 px-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p>{group.groupDescription || "No description set"}</p>
              {isAdmin && (
                <button
                  onClick={() => setEditingDescription(true)}
                  className="text-blue-400 text-sm hover:underline"
                >
                  Change
                </button>
              )}
            </div>
          )}
        </div>

        {/* Admin */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Admin</label>
          <p>{group.admin?.fullname || "Unknown"}</p>
        </div>

        {/* Members */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Members</label>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {group.members?.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded text-sm"
              >
                <span>{member.fullname}</span>
                {isAdmin && member._id !== group.admin?._id && (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              Add Members
            </button>
          )}
        </div>

        {/* Delete Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
          >
            {isAdmin ? "Transfer & Leave Group" : "Leave Group"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          Close
        </button>
      </div>

      {/* Add Members Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowAddModal(false)}
          ></div>
          <div className="relative bg-[#1e293b] text-white w-full max-w-sm rounded-xl p-6 z-50 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Add Members</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {availableUsers.length === 0 ? (
                <p className="text-gray-400 text-sm">No available users</p>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded"
                  >
                    <span>{user.fullname}</span>
                    <input
                      type="checkbox"
                      checked={selectedToAdd.includes(user._id)}
                      onChange={() => toggleSelectToAdd(user._id)}
                    />
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembers}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
          <div className="relative bg-[#1e293b] text-white w-full max-w-sm rounded-xl p-6 z-50 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">
              Confirm {isAdmin ? "Admin Transfer" : "Leave Group"}
            </h3>

            {isAdmin && (
              <>
                <p className="text-sm mb-2">
                  Select a new admin before leaving:
                </p>
                <select
                  value={selectedNewAdmin}
                  onChange={(e) => setSelectedNewAdmin(e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded mb-4"
                >
                  <option value="">Select member</option>
                  {membersToSelectAdmin.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.fullname}
                    </option>
                  ))}
                </select>
              </>
            )}

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSettings;
