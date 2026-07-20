import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidLeftArrowSquare } from "react-icons/bi";
import { motion } from "framer-motion";
import apiClient from "../services/api.js";

function LivePreview() {
  const { id } = useParams();
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const navigate = useNavigate();

  const liveUrl = `${window.location.origin}/site/${id}`;

  useEffect(() => {
    const fetchLiveSite = async () => {
      try {
        const response = await apiClient.get(`/website/getbyslug/${id}`);
        setHtml(response.data?.latestcode || "");
      } catch (err) {
        console.error("Failed to load live website:", err);
        setError(err?.response?.data?.message || "Website Not Found or Error Loading");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLiveSite();
  }, [id]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopySuccess("URL copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch {
      setCopySuccess("Failed to copy URL");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-lg">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Live Web Application...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-400 gap-4">
        <p className="text-xl font-semibold">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/dashboard")}
          >
            <BiSolidLeftArrowSquare
              size={28}
              className="text-zinc-400 group-hover:text-white transition"
            />
            <span className="text-lg font-semibold tracking-wide">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCopyUrl}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer shadow-lg shadow-purple-600/20"
            >
              Share / Copy URL
            </button>
            {copySuccess && (
              <span className="text-sm text-emerald-400 font-medium">{copySuccess}</span>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Preview Frame */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-zinc-200">Deployed Site Preview</h1>
          <p className="text-xs font-mono text-zinc-500">
            {liveUrl}
          </p>
        </div>

        <div className="flex-1 w-full border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl bg-white min-h-[75vh]">
          <iframe
            srcDoc={html}
            title="Live Deployed Website"
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </main>
    </div>
  );
}

export default LivePreview;
