import React from "react";
import { useChatStore } from "../store/useChatStore";
import useGroupChatStore from "../store/useGroupChatStore";
import ChatContainer from "./ChatContainer";
import GroupChatContainer from "./GroupChatContainer";

const MainChatContainer = () => {
  const { userClicked } = useChatStore();
  const { groupClicked } = useGroupChatStore();

  if (groupClicked) return <GroupChatContainer />;
  if (userClicked) return <ChatContainer />;

  return (
    <div className="flex items-center justify-center h-full text-gray-400 italic">
      Select a user or group to start chatting
    </div>
  );
};

export default MainChatContainer;
