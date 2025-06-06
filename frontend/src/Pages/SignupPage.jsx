import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signup } = useAuthStore();
  const validateForm = () => {
    if (!formData.fullname.trim()) {
      return toast.error("Please enter your name");
    }
    if (!formData.email.trim()) {
      return toast.error("Please enter your email");
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }
    if (!formData.password) {
      return toast.error("Please enter your password");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const issuccess = validateForm();
    if (issuccess === true) {
      try {
        await signup(formData);
      } catch (error) {
        console.error("Signup error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4 bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90%">
      <div className="w-full max-w-md bg-base-100 p-8 rounded-lg shadow-lg text-base border-4 border-blue-500 ">
        <h2 className="text-3xl font-bold text-center mb-2">Sign Up</h2>
        <h3 className="text-xl font-bold text-center text-blue-500 mb-6">
          Chattify
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered ml-2"
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="input input-bordered ml-3"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <div className="flex items-center gap-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered flex-1"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="btn btn-xs btn-ghost ml-2 w-16 text-center whitespace-nowrap"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white py-2 px-4 rounded"
              onClick={() => handleSubmit()}
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-500 mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
