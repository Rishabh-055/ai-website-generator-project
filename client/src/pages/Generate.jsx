import React, { useState } from "react";
import { BiSolidLeftArrowSquare } from "react-icons/bi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api.js";

function Generate() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [prompt, setPrompt] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generationSteps = [
    "Analyzing design requirements...",
    "Synthesizing visual themes & color palettes...",
    "Building responsive HTML structure...",
    "Styling with CSS Grid & Flexbox...",
    "Adding interactive JavaScript behavior...",
    "Optimizing responsiveness & images...",
    "Finalizing Web Application...",
  ];

  const handleGenerateWebsite = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgress(5);
    setStatusMessage(generationSteps[0]);

    // Asynchronously call backend AI API while stepping through UI progress status
    const apiPromise = apiClient.post("/website/generate", { prompt });

    // Step through visual progress intervals
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const next = prev + 12;
        const stepIndex = Math.min(
          Math.floor((next / 100) * generationSteps.length),
          generationSteps.length - 1
        );
        setStatusMessage(generationSteps[stepIndex]);
        return next;
      });
    }, 1200);

    try {
      const response = await apiPromise;
      clearInterval(interval);
      setProgress(100);
      setStatusMessage("Website generated successfully! Redirecting...");

      setTimeout(() => {
        setIsGenerating(false);
        if (response.data?.websiteId) {
          navigate(`/editor/${response.data.websiteId}`);
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (error) {
      clearInterval(interval);
      console.error("Website generation failed:", error?.response?.data?.message || error);
      setStatusMessage(error?.response?.data?.message || "Generation failed. Please try again.");
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black w-full text-white flex flex-col">
      {/* Top Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-white/10 bg-zinc-950/60 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/dashboard")}
          >
            <BiSolidLeftArrowSquare
              size={28}
              className="text-gray-400 group-hover:text-white transition"
            />
            <span className="text-lg font-semibold tracking-wide">
              Generator Studio
            </span>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl"
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border border-purple-500"
            />
            <span className="text-sm font-medium">{user?.name || "Account"}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Studio Prompt Form */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 text-center flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4"
        >
          Create Websites with <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">AI Power</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto"
        >
          Enter your prompt or idea below. GenWeb.AI will craft a fully responsive, ready-to-use web application in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. A modern SaaS landing page for a coffee subscription app with a hero section, features grid, pricing tables, and contact form..."
            className="w-full h-36 bg-black/80 border border-zinc-700 rounded-xl p-4 text-white text-sm sm:text-base outline-none focus:border-amber-400 transition resize-none placeholder:text-zinc-600"
          />

          <motion.button
            whileHover={{ scale: isGenerating ? 1 : 1.02 }}
            whileTap={{ scale: isGenerating ? 1 : 0.98 }}
            className={`mt-6 px-10 py-3.5 rounded-xl font-bold text-base transition shadow-lg cursor-pointer ${
              isGenerating
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:brightness-110 shadow-yellow-500/20"
            }`}
            onClick={handleGenerateWebsite}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? "Generating Website..." : "Generate Website (50 Credits)"}
          </motion.button>

          {isGenerating && (
            <div className="mt-6 space-y-3">
              <div className="text-sm font-medium text-amber-300">
                {statusMessage}
              </div>

              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.5 }}
                />
              </div>

              <p className="text-xs text-zinc-500 font-mono">
                {progress}% Completed
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Generate;
