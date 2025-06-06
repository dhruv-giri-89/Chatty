import React from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import ContainSkeleton from "../components/ContainSkeleton";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { userClicked } = useChatStore();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        {userClicked ? <ChatContainer /> : <ContainSkeleton />}
      </div>
    </div>
  );
};

export default HomePage;
