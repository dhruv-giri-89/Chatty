import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, authUser } = useAuthStore();
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, scale: 0.8, y: -20 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "elastic.out(1, 0.5)" }
    );
  }, []);

  const validateForm = () => {
    if (!formData.email) {
      toast.error("Please enter your email");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      toast.error("Please enter your password");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      await login(formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4 bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90%">
      <div className="w-full max-w-md bg-base-100 p-8 rounded-lg shadow-lg text-base border-4 border-blue-500">
        <h2 ref={headingRef} className="text-3xl font-bold text-center mb-2">
          Log In
        </h2>
        <h3 className="text-xl font-bold text-center text-blue-500 mb-6">
          Chattify
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              required
            />
          </div>

          <div className="form-control">
            <div className="flex items-center gap-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-16"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="btn btn-xs btn-ghost min-w-[3.5rem]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white"
            >
              Log In
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500 mt-2">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
