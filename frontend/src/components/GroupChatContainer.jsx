import React, { useState, useRef } from "react";
import { Camera, MoreVertical } from "lucide-react";
import useGroupChatStore from "../store/useGroupChatStore";
import GroupMessagesContainer from "./subcomponents/GroupMessagesContainer";
import GroupSettings from "./subcomponents/GroupSettings";

const GroupChatContainer = () => {
  const { groupClicked, sendGroupMessage } = useGroupChatStore();
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  if (!groupClicked) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 italic">
        Select a group to start chatting
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertToBase64(file).then((base64) => setSelectedImage(base64));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed && !selectedImage) return;

    await sendGroupMessage({
      groupId: groupClicked._id,
      text: trimmed,
      image: selectedImage || null,
    });

    setMessage("");
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const openGroupSettings = () => {
    setShowSettings(true);
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col h-full p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-600 pb-2 mb-4 relative">
        <div className="flex items-center gap-3">
          {groupClicked.groupProfilePicture ? (
            <img
              src={groupClicked.groupProfilePicture}
              alt={groupClicked.groupName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              {groupClicked.groupName?.charAt(0).toUpperCase() || "G"}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-white">
              {groupClicked.groupName}
            </h2>
            {groupClicked.groupDescription && (
              <p className="text-sm text-gray-400">
                {groupClicked.groupDescription}
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            className="p-2 rounded hover:bg-gray-700"
            onClick={toggleDropdown}
          >
            <MoreVertical className="w-6 h-6 text-white" />
          </button>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-40 bg-[#1e293b] border border-gray-600 rounded shadow-lg z-10 text-white"
            >
              <button
                onClick={openGroupSettings}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Group Settings
              </button>

              {/* Add more menu items here */}
              {/* <button className="block w-full text-left px-4 py-2 hover:bg-gray-700">
                Add Members
              </button> */}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 bg-[#0f172a] rounded-md p-4">
        <GroupMessagesContainer />
      </div>

      {/* Input */}
      <form className="flex items-center gap-2" onSubmit={handleSubmit}>
        <label className="cursor-pointer text-white">
          <Camera className="w-6 h-6" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-500 bg-[#1e293b] text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>

      {/* Image preview */}
      {selectedImage && (
        <div className="mt-2">
          <img
            src={selectedImage}
            alt="preview"
            className="w-32 h-32 object-cover rounded"
          />
        </div>
      )}

      {/* Group Settings Modal */}
      {showSettings && (
        <GroupSettings
          group={groupClicked}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default GroupChatContainer;
