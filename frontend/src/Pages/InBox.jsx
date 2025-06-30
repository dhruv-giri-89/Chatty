import React, { useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import defaultPhoto from "../assets/photo.png";
import { UserPlus, Check, X } from "lucide-react";

const InBox = () => {
  const { 
    friendRequests, 
    getFriendRequests, 
    requestsLoading, 
    acceptFriendRequest, 
    deleteFriendRequest 
  } = useFriendStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  const handleAcceptRequest = async (friendshipId) => {
    await acceptFriendRequest(friendshipId);
  };

  const handleRejectRequest = async (friendshipId) => {
    await deleteFriendRequest(friendshipId);
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-base-100 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-base-content">Friend Requests</h1>
          </div>
          <p className="text-base-content/70">
            Manage your incoming friend requests. Accept or reject requests from other users.
          </p>
        </div>

        {/* Friend Requests List */}
        <div className="bg-base-100 rounded-lg shadow-sm">
          {requestsLoading ? (
            <div className="p-8 text-center">
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <p className="text-base-content/70">Loading friend requests...</p>
            </div>
          ) : friendRequests.length === 0 ? (
            <div className="p-8 text-center">
              <UserPlus className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-base-content mb-2">
                No Friend Requests
              </h3>
              <p className="text-base-content/70">
                You don't have any pending friend requests at the moment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-base-300">
              {friendRequests.map((request) => {
                const requester = request.user1; // The user who sent the request
                
                return (
                  <div
                    key={request._id}
                    className="p-6 hover:bg-base-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      {/* User Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={requester.profilepic || defaultPhoto}
                            alt={requester.fullname}
                            className="w-16 h-16 rounded-full object-cover border-2 border-base-300"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <UserPlus className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <h3 className="text-lg font-semibold text-base-content">
                            {requester.fullname}
                          </h3>
                          <p className="text-base-content/70 text-sm">
                            {requester.email}
                          </p>
                          <p className="text-xs text-base-content/50 mt-1">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-success text-success-content rounded-lg hover:bg-success-focus transition-colors"
                          title="Accept friend request"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-error text-error-content rounded-lg hover:bg-error-focus transition-colors"
                          title="Reject friend request"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        {friendRequests.length > 0 && (
          <div className="mt-6 bg-base-100 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm text-base-content/70">
              <span>
                {friendRequests.length} pending request{friendRequests.length !== 1 ? 's' : ''}
              </span>
              <span>
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InBox;
