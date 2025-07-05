import React, { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const ChatMessagesContainer = () => {
  const { authUser } = useAuthStore();
  const currentUserId = authUser?._id;

  const { userClicked, messages, getMessages, subMessage, unsubMessage } =
    useChatStore();

  // Ref for auto-scrolling to the latest message
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages and subscribe to updates
  useEffect(() => {
    if (userClicked?._id) {
      getMessages(userClicked._id); // Fetch existing messages
      subMessage(userClicked._id); // Subscribe to new messages

      return () => {
        unsubMessage(userClicked._id); // Unsubscribe on cleanup
      };
    }
  }, [userClicked?._id, getMessages, subMessage, unsubMessage]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isMyMessage = (message) => message.sender === currentUserId;

  const getProfilePic = (user) => {
    if (user?.profilepic && user.profilepic.trim() !== "")
      return user.profilepic;
    return "/defaultPhoto.webp"; // Use the default photo from public folder
  };

  return (
    <div
      className="chat-messages-container"
      style={{
        overflowY: "auto",
        height: "100%",
        padding: "15px",
        backgroundColor: "#0f172a",
      }}
    >
      {messages.map((message) => {
        const fromCurrentUser = isMyMessage(message);
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

            {/* Show chat bubble if there's text and no media */}
            {!message.image && !message.video && message.text && (
              <div className="chat-bubble">{message.text}</div>
            )}

            {/* Hardcoded delivery/seen status */}
            {fromCurrentUser ? (
              <div className="chat-footer opacity-50">Seen at 12:46</div>
            ) : (
              <div className="chat-footer opacity-50">Delivered</div>
            )}
          </div>
        );
      })}

      {/* Ref element for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessagesContainer;
