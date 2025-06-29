import React from "react";
import Sidebar from "../components/Sidebar";
import MainChatContainer from "../components/MainChatContainer"; // Use the unified container
import ContainSkeleton from "../components/ContainSkeleton";
import { useChatStore } from "../store/useChatStore";
import useGroupChatStore from "../store/useGroupChatStore";

const HomePage = () => {
  const { userClicked } = useChatStore();
  const { groupClicked } = useGroupChatStore();

  const showChat = userClicked || groupClicked;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        {showChat ? <MainChatContainer /> : <ContainSkeleton />}
      </div>
    </div>
  );
};

export default HomePage;
