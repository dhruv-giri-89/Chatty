import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User, MessageCircle, Inbox } from "lucide-react"; // Added Inbox icon
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between bg-base-200 text-base-content px-6 py-4 shadow-md border-2 border-primary rounded-lg">
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
          <button
            className="flex items-center gap-1 hover:underline"
            onClick={() => navigate("/inbox")} // Added navigation to inbox
          >
            <Inbox className="w-5 h-5" /> {/* Inbox icon */}
            Inbox
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
