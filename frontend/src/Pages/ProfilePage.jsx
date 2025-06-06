import React, { useRef, useState } from "react";
import { Camera, RemoveFormatting } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import defaultPhoto from "../assets/photo.png";

const ProfilePage = () => {
  const { authUser, updateprofile } = useAuthStore();
  const hasHydrated = useAuthStore.persist?.hasHydrated?.();
  const fileInputRef = useRef(null);
  const [profilepic, updateprofilepic] = useState("");
  if (!hasHydrated) {
    return <div className="text-white">Loading...</div>;
  }

  if (!authUser) {
    return <div className="text-white">No user found. Please log in.</div>;
  }
  const calculateMemberSinceMonths = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const yearsDiff = now.getFullYear() - createdDate.getFullYear();
    const monthsDiff = now.getMonth() - createdDate.getMonth();

    const totalMonths = yearsDiff * 12 + monthsDiff;

    return totalMonths > 0
      ? `${totalMonths} month${totalMonths > 1 ? "s" : ""} ago`
      : "Less than a month";
  };

  const date = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const user = {
    name: authUser.fullname || "Unnamed User",
    email: authUser.email || "No email",
    profileImage: authUser.profilepic || defaultPhoto,
    accountInfo: {
      activeStatus: "Online",
      memberSince: calculateMemberSinceMonths(authUser.createdAt),

      lastLogin: date(authUser.updatedAt) || "Never logged in",
    },
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      updateprofilepic(base64Image);
      await updateprofile({ profilepic: base64Image });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-base-200">
      <div className="relative">
        <img
          src={user.profileImage}
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg"
        />
        <button
          onClick={handleCameraClick}
          className="absolute bottom-0 right-0 bg-primary hover:bg-primary-focus text-white p-2 rounded-full border-2 border-white shadow-md"
          aria-label="Change Profile Picture"
          title="Change Profile Picture"
          style={{ transform: "translate(-15%, -15%)" }}
        >
          <Camera className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="card bg-base-100 shadow-lg p-8 max-w-md mx-auto mt-10">
        <div className="flex flex-col items-center">
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-base-200 mb-4"
          />
          <h2 className="card-title text-base-content mb-2">{user.name}</h2>
          <p className="text-base-content mb-4">{user.email}</p>
          <button className="btn btn-primary">Edit Profile</button>
        </div>
      </div>

      <div className="mt-6 w-full max-w-md rounded-lg border-2 border-primary p-6 shadow-lg bg-base-100 text-base-content">
        <h1 className="text-3xl font-semibold">{user.name}</h1>
        <p>{user.email}</p>

        <div className="mt-8 bg-base-200 rounded-lg shadow-md p-6 text-base-content">
          <h2 className="text-xl font-semibold mb-4 border-b border-base-300 pb-2">
            Account Information
          </h2>
          <ul className="space-y-3">
            <li>
              <strong>Active Status:</strong> {user.accountInfo.activeStatus}
            </li>
            <li>
              <strong>Member Since:</strong> {user.accountInfo.memberSince}
            </li>
            <li>
              <strong>Last Login:</strong> {user.accountInfo.lastLogin}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
