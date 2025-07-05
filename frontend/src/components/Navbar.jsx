import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import { LogOut, Settings, User, MessageCircle, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { 
    notificationCount, 
    friendRequestCount, 
    getNotificationCount, 
    getFriendRequestCount 
  } = useFriendStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      getNotificationCount();
      getFriendRequestCount();
    }
  }, [authUser, getNotificationCount, getFriendRequestCount]);

  return (
    <nav className="flex items-center justify-between bg-base-200 text-base-content px-6 py-4 shadow-md border-2 border-primary">
      {/* Logo + Chat Icon */}
      <div 
        className="flex items-center gap-2 text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
        onClick={() => navigate("/")}
        title="Go to Homepage"
      >
        <MessageCircle className="w-7 h-7 text-blue-400" />
        Chatty
      </div>

      {/* Right-side buttons only when logged in */}
      {authUser && (
        <div className="flex gap-6 items-center">
          {/* Inbox with friend request count */}
          <button
            className="flex items-center gap-1 hover:underline relative"
            onClick={() => navigate("/inbox")}
          >
            <Inbox className="w-5 h-5" />
            Inbox
            {(friendRequestCount + notificationCount) > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(friendRequestCount + notificationCount) > 99 ? '99+' : (friendRequestCount + notificationCount)}
              </span>
            )}
          </button>

          <button
            className="flex items-center gap-1 hover:underline"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button
            className="flex items-center gap-1 hover:underline"
            onClick={() => navigate("/profilepic")}
          >
            <User className="w-5 h-5" />
            Profile
          </button>
          <button
            className="flex items-center gap-1 text-red-400 hover:underline"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
