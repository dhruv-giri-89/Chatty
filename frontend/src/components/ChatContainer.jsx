import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { MoreVertical, Image, UserMinus, Shield } from "lucide-react";
import defaultPhoto from "../assets/photo.png";
import ChatMessagesContainer from "./subcomponents/ChatMessagesContainer";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const { userClicked, sendMessage, setUserClicked } = useChatStore();
  const { removeFriend } = useFriendStore();
  const [message, setMessageInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  if (!userClicked) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 italic">
        Select a user to start chatting
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
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage && !selectedImage) return;

    await sendMessage({
      recipientId: userClicked._id,
      text: trimmedMessage || "",
      image: selectedImage || null,
    });

    setMessageInput("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFriend = async () => {
    setMenuOpen(false);
    await removeFriend(userClicked._id);
    // Clear the current chat after removing friend
    setUserClicked(null);
  };

  const handleBlockUser = () => {
    setMenuOpen(false);
    // TODO: Implement block functionality
    console.log("Block functionality will be implemented later");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.relative')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-600 pb-2 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={userClicked.profilepic || defaultPhoto}
            alt={userClicked.fullname}
            className="w-12 h-12 rounded-full object-cover"
          />
          <h2 className="text-lg font-semibold text-white">
            {userClicked.fullname}
          </h2>
        </div>
        <div className="relative">
          <button 
            onClick={toggleMenu}
            className="p-2 rounded hover:bg-gray-700"
          >
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-gray-600 rounded shadow-lg z-20">
              <ul className="py-1">
                <li
                  onClick={handleRemoveFriend}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                >
                  <UserMinus className="w-4 h-4" />
                  Remove Friend
                </li>
                <li
                  onClick={handleBlockUser}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  Block
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto mb-4 bg-[#0f172a] p-4">
        <ChatMessagesContainer />
      </div>

      {/* Input field */}
      <form className="flex items-center gap-2" onSubmit={handleSubmit}>
        <label className="cursor-pointer text-white">
          <Image className="w-6 h-6" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
        </label>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-500 bg-[#1e293b] text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>

      {/* Preview selected image */}
      {selectedImage && (
        <div className="mt-2">
          <img
            src={selectedImage}
            alt="preview"
            className="w-32 h-32 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
