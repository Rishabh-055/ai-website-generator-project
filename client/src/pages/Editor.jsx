import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRocket,
  FaCode,
  FaEye,
  FaTimes,
  FaHome,
  FaPaperPlane,
} from "react-icons/fa";
import MonacoEditor from "@monaco-editor/react";
import apiClient from "../services/api.js";

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const response = await apiClient.get(`/website/getwebsite/${id}`);
        setWebsite(response.data);
        setCode(response.data.latestcode || "");
        setChatHistory(response.data.conversations || []);
      } catch (err) {
        console.error("Failed to load website details:", err);
        setError(err?.response?.data?.message || "Error loading workspace editor.");
      }
    };

    if (id) fetchWebsiteData();
  }, [id]);

  const handleUpdateWebsite = async () => {
    if (!prompt.trim() || isUpdating) return;

    setIsUpdating(true);
    const userPromptText = prompt.trim();
    setPrompt("");

    const userMessage = { role: "user", content: userPromptText };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const response = await apiClient.post(`/website/update/${id}`, {
        prompt: userPromptText,
      });

      const aiMessage = {
        role: "ai",
        content: response.data.message || "Updated website successfully.",
      };

      setChatHistory((prev) => [...prev, aiMessage]);
      if (response.data?.code) {
        setCode(response.data.code);
      }
    } catch (err) {
      console.error("Failed to update website layout:", err);
      const errorMessage = {
        role: "ai",
        content: err?.response?.data?.message || "Failed to process modification request.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeployWebsite = async () => {
    try {
      setIsDeploying(true);
      const response = await apiClient.get(`/website/deploy/${id}`);
      if (response.data?.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (err) {
      console.error("Deployment failed:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-red-400 gap-4">
        <p className="text-xl font-semibold">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Editor Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Editor Navigation Bar */}
      <header className="flex justify-between items-center px-6 py-3 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-base sm:text-lg text-white truncate max-w-xs">
            {website.title || "Web Editor"}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <button
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
            onClick={() => setIsFullPreviewOpen(true)}
          >
            <FaEye /> Full Preview
          </button>

          <button
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
            onClick={() => setIsCodeDrawerOpen(true)}
          >
            <FaCode /> View Code
          </button>

          <button
            onClick={handleDeployWebsite}
            disabled={isDeploying}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-1.5 rounded-lg font-bold hover:brightness-110 transition cursor-pointer"
          >
            <FaRocket /> {isDeploying ? "Deploying..." : "Deploy"}
          </button>

          <button
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <FaHome /> Dashboard
          </button>
        </div>
      </header>

      {/* Main Split Layout: AI Chat Assistant & Live Iframe */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: AI Workspace Assistant Chat */}
        <aside className="w-[380px] lg:w-[420px] border-r border-zinc-800 flex flex-col bg-zinc-950">
          <div className="px-4 py-3 border-b border-zinc-800 font-semibold text-xs text-zinc-400 tracking-wider uppercase">
            AI Co-Pilot Assistant
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`p-3.5 rounded-xl max-w-[88%] text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-purple-600/90 text-white ml-auto rounded-br-xs"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-xs"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </motion.div>
            ))}
            {isUpdating && (
              <div className="p-3.5 rounded-xl max-w-[88%] bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span>AI is rewriting site layout...</span>
              </div>
            )}
          </div>

          {/* Chat Form Prompt Input */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateWebsite()}
              type="text"
              placeholder="Ask AI to modify site (e.g., change navbar color to dark red)..."
              className="flex-1 bg-black border border-zinc-800 px-4 py-2 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-purple-500 transition placeholder:text-zinc-600"
            />

            <button
              onClick={handleUpdateWebsite}
              disabled={isUpdating || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-800 px-4 py-2 rounded-xl text-white transition flex items-center justify-center cursor-pointer"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </aside>

        {/* Right Side: Live HTML Render Canvas */}
        <main className="flex-1 bg-white relative">
          <iframe
            srcDoc={code}
            title="Live Canvas Web Preview"
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </main>
      </div>

      {/* Code Drawer Panel Modal */}
      <AnimatePresence>
        {isCodeDrawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-[50vw] min-w-[480px] h-full bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
              <h3 className="font-bold text-sm tracking-wide text-zinc-200">Source Code Inspection</h3>

              <button
                onClick={() => setIsCodeDrawerOpen(false)}
                className="text-zinc-400 hover:text-white transition p-1 cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="flex-1">
              <MonacoEditor
                height="100%"
                language="html"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  wordWrap: "on",
                  minimap: { enabled: false },
                  fontSize: 13,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {isFullPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-3 border-b border-zinc-800 bg-zinc-950 text-white">
              <h2 className="text-sm font-semibold text-zinc-300">Full Screen Preview</h2>

              <button
                onClick={() => setIsFullPreviewOpen(false)}
                className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            <div className="flex-1 bg-white">
              <iframe
                srcDoc={code}
                title="Full Preview Window"
                className="w-full h-full border-none"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Editor;
