import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { buildUrl } from "../config/api";

function Signup() {
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    try {
      const res = await axios.post(buildUrl("/api/v1/user/register"), user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }

    setUser({
      fullname: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full lg:w-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Create Account
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              value={user.fullname}
              onChange={(e) => setUser({ ...user, fullname: e.target.value })}
              type="text"
              className="w-full rounded-lg border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white "
              placeholder="Full name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              type="text"
              className="w-full rounded-lg border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              className="w-full rounded-lg border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              type="password"
              className="w-full rounded-lg border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex gap-6 text-sm text-gray-700 dark:text-gray-300">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                required
              />
              Male
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                required
              />
              Female
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-medium transition"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className=" font-medium text-primary-600 hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Signup;
