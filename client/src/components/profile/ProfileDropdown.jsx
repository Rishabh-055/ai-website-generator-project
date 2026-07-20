import React from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api";

function ProfileDropdown({ onClose }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.get("/auth/logout");
      dispatch(clearCredentials());
      onClose();
      navigate("/");
    } catch (error) {
      console.error("Failed to execute logout on server:", error);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ duration: 0.25 }}
      className="absolute right-0 mt-3 w-[260px] bg-black border border-gray-700 rounded-xl shadow-2xl p-4 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center border-b border-gray-700 pb-3 cursor-pointer">
        <img
          src={
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
          }
          className="h-[60px] w-[60px] rounded-full border-2 border-orange-500"
          alt="User Profile"
        />
        <p className="mt-2 text-white font-semibold">{user.name}</p>
        <p className="text-gray-400 text-sm">{user.email}</p>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-gray-400">Total Coins</span>
        <span className="text-orange-400 font-bold">{user.credit}</span>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 transition duration-200 text-white font-medium cursor-pointer"
      >
        Logout
      </button>
      
      <button 
        onClick={onClose}
        className="mt-4 w-full py-2 rounded-lg hover:bg-gray-900 transition duration-200 text-white font-medium border border-gray-700 cursor-pointer"
      >
        Close Menu
      </button>
    </motion.div>
  );
}

export default ProfileDropdown;
