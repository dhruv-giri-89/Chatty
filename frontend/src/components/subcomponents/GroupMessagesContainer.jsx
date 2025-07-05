import React, { useEffect, useRef } from "react";
import useGroupChatStore from "../../store/useGroupChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const GroupMessagesContainer = () => {
  const { groupClicked, groupMessages, setGroupMessages, getGroupMessages, addGroupMessage, subGroupMessages, unsubGroupMessages } = useGroupChatStore();
  const { authUser, socket } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (groupClicked?._id) {
      getGroupMessages(groupClicked._id);
      subGroupMessages();
      return () => {
        unsubGroupMessages();
      };
    }
  }, [groupClicked, getGroupMessages, subGroupMessages, unsubGroupMessages]);

  useEffect(() => {
    if (!socket) return;
    const handleNewGroupMessage = (message) => {
      if (message.receiverGroup === groupClicked?._id) {
        addGroupMessage(message);
      }
    };
    socket.on("newGroupMessage", handleNewGroupMessage);
    return () => {
      socket.off("newGroupMessage", handleNewGroupMessage);
    };
  }, [socket, groupClicked, addGroupMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  if (!groupClicked) return null;

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      {groupMessages?.length === 0 && (
        <div className="text-center text-gray-400">No messages yet.</div>
      )}
      {groupMessages?.map((msg) => (
        <div key={msg._id} className={`flex flex-col ${msg.sender._id === authUser._id ? "items-end" : "items-start"}`}>
          <div className="flex items-center gap-2">
            <img src={msg.sender.avatar || msg.sender.profilepic} alt={msg.sender.username || msg.sender.fullname} className="w-8 h-8 rounded-full object-cover" />
            <span className="text-xs text-gray-400">{msg.sender.username || msg.sender.fullname}</span>
          </div>
          <div className={`rounded-lg px-4 py-2 mt-1 ${msg.sender._id === authUser._id ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}>
            {msg.text && <div>{msg.text}</div>}
            {msg.image && <img src={msg.image} alt="attachment" className="mt-2 max-w-xs rounded" />}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default GroupMessagesContainer;
