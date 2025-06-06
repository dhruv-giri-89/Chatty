import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import defaultPhoto from "../assets/photo.png";

const Sidebar = () => {
  const { users, getUsers, setUserClicked } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="w-64 bg-base-100 border-2 border-primary rounded-lg p-4 overflow-y-auto h-screen">
      <h2 className="text-xl font-semibold mb-4 text-base-content">Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id || user._id}
            onClick={() => setUserClicked(user)}
            className="flex items-center gap-3 p-2 rounded hover:bg-base-200 cursor-pointer"
          >
            <img
              src={user.profilepic || defaultPhoto}
              alt={user.fullname}
              className="w-8 h-8 rounded-full object-cover border border-base-200"
            />
            <span className="font-medium text-base-content">
              {user.fullname}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
