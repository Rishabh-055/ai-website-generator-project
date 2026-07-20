import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { auth, googleAuthProvider } from "../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice.js";
import apiClient from "../../services/api.js";

function LoginModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    setErrorMessage("");

    try {
      const authResult = await signInWithPopup(auth, googleAuthProvider);
      
      const response = await apiClient.post("/auth/login", {
        name: authResult.user.displayName,
        email: authResult.user.email,
        avatar: authResult.user.photoURL,
      });

      if (response.data?.user) {
        dispatch(setCredentials(response.data.user));
        setIsAuthenticating(false);
        onClose();
      } else {
        throw new Error(response.data?.message || "Authentication failed.");
      }
    } catch (error) {
      console.error("Failed to authenticate user via Google:", error);
      const msg = error?.response?.data?.message || error?.message || "Authentication failed. Please try again.";
      setErrorMessage(msg);
      setIsAuthenticating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-md z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 text-white w-[380px] p-8 rounded-2xl shadow-2xl relative border border-gray-800"
          >
            <h2 className="text-2xl font-bold text-center mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                GenWeb.AI
              </span>
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs text-center leading-relaxed">
                {errorMessage}
              </div>
            )}

            <button
              disabled={isAuthenticating}
              className={`w-full h-[55px] bg-white text-black rounded-xl 
              flex items-center justify-center gap-3 
              font-semibold shadow-md 
              hover:shadow-lg transition-all duration-200 ${
                isAuthenticating ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] cursor-pointer"
              }`}
              onClick={handleGoogleAuth}
            >
              {isAuthenticating ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <FcGoogle size={24} />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <button
              disabled={isAuthenticating}
              className="mt-4 w-full border border-gray-700 py-2 rounded-lg hover:bg-gray-800 transition duration-200 cursor-pointer text-gray-400 font-semibold text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            
            <div className="flex justify-center items-center p-[10px] my-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs tracking-wide text-zinc-500 px-3 uppercase">
                Secure Login
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            
            <div className="text-gray-400 font-light text-center text-xs space-y-1">
              <p>By continuing you agree to our</p>
              <div className="flex justify-center gap-2">
                <span className="underline cursor-pointer hover:text-gray-300">
                  Terms of Service
                </span>
                <span>&bull;</span>
                <span className="underline cursor-pointer hover:text-gray-300">
                  Privacy Policy
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;
