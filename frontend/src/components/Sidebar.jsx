import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import defaultPhoto from "../assets/photo.png";
import { useAuthStore } from "../store/useAuthStore";
import useGroupChatStore from "../store/useGroupChatStore";
import { MoreVertical } from "lucide-react";
import CreateGroup from "./createGroup";

const Sidebar = () => {
  const { users, getUsers, setUserClicked, userClicked } = useChatStore();
  const { friends, getFriends, friendsLoading } = useFriendStore();
  const { groups, getGroups, groupsLoading, groupClicked, setGroupClicked } =
    useGroupChatStore();
  const { onlineUsers } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);

  useEffect(() => {
    getGroups();
    getUsers();
    getFriends();
  }, [getGroups, getUsers, getFriends]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCreateGroup = () => {
    setMenuOpen(false);
    setCreateGroupModalOpen(true);
  };

  return (
    <>
      <div className="w-64 bg-base-100 border-2 border-primary rounded-lg p-4 overflow-y-auto h-screen">
        {/* ---------------- Friends Section ---------------- */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-base-content mb-2">
            Friends
          </h2>
          <ul className="space-y-2">
            {friendsLoading ? (
              <li className="text-sm text-base-content">Loading friends...</li>
            ) : friends.length === 0 ? (
              <li className="text-sm text-base-content">No friends yet</li>
            ) : (
              friends.map((friend) => {
                const userId = friend._id || friend.id;
                const isUserActive = userClicked?._id === userId;

                return (
                  <li
                    key={userId}
                    onClick={() => setUserClicked(friend)}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                      isUserActive
                        ? "bg-primary text-white"
                        : "hover:bg-base-200"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={friend.profilepic || defaultPhoto}
                        alt={friend.fullname}
                        className="w-10 h-10 rounded-full object-cover border border-base-200"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          onlineUsers.includes(userId)
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-medium ${
                        isUserActive ? "text-white" : "text-base-content"
                      }`}
                    >
                      {friend.fullname}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* ---------------- Groups Header + Menu ---------------- */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-base-content">Groups</h2>
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="p-1 rounded hover:bg-base-300"
            >
              <MoreVertical className="w-5 h-5 text-base-content" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-base-100 border border-base-300 rounded shadow-lg z-20">
                <ul className="py-1">
                  <li
                    onClick={handleCreateGroup}
                    className="px-4 py-2 text-sm hover:bg-base-200 cursor-pointer"
                  >
                    Create Group
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- Groups Section ---------------- */}
        <ul className="space-y-2 mb-6">
          {groupsLoading ? (
            <li className="text-sm text-base-content">Loading groups...</li>
          ) : groups.length === 0 ? (
            <li className="text-sm text-base-content">No groups available</li>
          ) : (
            groups.map((group) => {
              const isActive = groupClicked?._id === group._id;
              return (
                <li
                  key={group._id}
                  onClick={() => setGroupClicked(group)}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                    isActive ? "bg-primary text-white" : "hover:bg-base-200"
                  }`}
                >
                  {group.groupProfilePicture ? (
                    <img
                      src={group.groupProfilePicture}
                      alt={group.groupName}
                      className="w-10 h-10 rounded-full object-cover border border-base-200"
                    />
                  ) : (
                    <div className="w-10 h-10 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                      {group.groupName?.charAt(0).toUpperCase() || "G"}
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span
                      className={`font-medium truncate ${
                        isActive ? "text-white" : "text-base-content"
                      }`}
                    >
                      {group.groupName}
                    </span>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        {/* ---------------- Users Section ---------------- */}
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-base-content mb-2">
            Users
          </h2>
        </div>
        <ul className="space-y-2">
          {users.map((user) => {
            const userId = user._id || user.id;
            const isUserActive = userClicked?._id === userId;

            return (
              <li
                key={userId}
                onClick={() => setUserClicked(user)}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                  isUserActive ? "bg-primary text-white" : "hover:bg-base-200"
                }`}
              >
                <div className="relative">
                  <img
                    src={user.profilepic || defaultPhoto}
                    alt={user.fullname}
                    className="w-10 h-10 rounded-full object-cover border border-base-200"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      onlineUsers.includes(userId)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
                <span
                  className={`font-medium ${
                    isUserActive ? "text-white" : "text-base-content"
                  }`}
                >
                  {user.fullname}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------------- Create Group Modal ---------------- */}
      <CreateGroup
        isOpen={createGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
