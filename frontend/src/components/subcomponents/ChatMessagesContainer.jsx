import React, { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const ChatMessagesContainer = () => {
  const { authUser } = useAuthStore();
  const currentUserId = authUser?._id;

  const { userClicked, messages, getMessages } = useChatStore();

  useEffect(() => {
    if (userClicked?._id) {
      getMessages(userClicked._id);
    }
  }, [userClicked?._id, getMessages]);

  const isMyMessage = (message) => message.sender === currentUserId;

  const getProfilePic = (user) => {
    if (user?.profilepic && user.profilepic.trim() !== "")
      return user.profilepic;
    // fallback placeholder image
    return "https://img.daisyui.com/images/profile/demo/kenobee@192.webp";
  };

  return (
    <div
      className="chat-messages-container"
      style={{
        overflowY: "auto",
        height: "100%",
        padding: "15px",
        backgroundColor: "#0f172a", // dark blue background
      }}
    >
      {messages.map((message) => {
        const fromCurrentUser = isMyMessage(message);

        // Use authUser avatar for sender, userClicked avatar for receiver
        const user = fromCurrentUser ? authUser : userClicked;

        return (
          <div
            key={message._id}
            className={`chat ${fromCurrentUser ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={user?.fullname || "User avatar"}
                  src={getProfilePic(user)}
                />
              </div>
            </div>

            <div className="chat-header">
              {user?.fullname || "Unknown User"}
              <time
                className="text-xs opacity-50"
                style={{ marginLeft: "8px" }}
              >
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>

            {/* Media content */}
            {message.image && (
              <img
                src={message.image}
                alt="attachment"
                className="rounded-md mb-2 max-w-xs"
              />
            )}

            {message.video && (
              <video controls className="rounded-md mb-2 max-w-xs">
                <source src={message.video} type="video/mp4" />
              </video>
            )}

            {/* Show chat bubble only if text exists AND no media */}
            {!message.image && !message.video && message.text && (
              <div className="chat-bubble">{message.text}</div>
            )}

            {/* Hardcoded delivery / seen status */}
            {fromCurrentUser ? (
              <div className="chat-footer opacity-50">Seen at 12:46</div>
            ) : (
              <div className="chat-footer opacity-50">Delivered</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessagesContainer;
