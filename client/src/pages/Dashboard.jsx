import React, { useEffect, useState } from "react";
import { BiSolidLeftArrowSquare } from "react-icons/bi";
import { FaRocket, FaExternalLinkAlt, FaPencilAlt } from "react-icons/fa";
import { RiAiGenerate } from "react-icons/ri";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api.js";

function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDeployWebsite = async (id) => {
    try {
      const response = await apiClient.get(`/website/deploy/${id}`);
      if (response.data?.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (err) {
      console.error("Deployment request failed:", err?.response?.data?.message || err);
    }
  };

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/website/getall");
        setWebsites(response.data || []);
      } catch (err) {
        console.error("Failed to load user projects:", err?.response?.data?.message || err);
        setError("Failed to fetch websites list.");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Top Navbar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-white/10 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-40"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <BiSolidLeftArrowSquare
              size={28}
              className="text-gray-400 group-hover:text-white transition"
            />
            <span className="text-lg font-semibold tracking-wide">
              Dashboard
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20 hover:brightness-110 transition cursor-pointer"
          >
            <RiAiGenerate size={20} />
            <span className="text-sm">Create New Site</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold"
          >
            Welcome back, <span className="text-purple-400">{user?.name || "User"}</span> 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-gray-400 text-sm sm:text-base mt-2"
          >
            Manage, edit, or deploy your AI-generated websites.
          </motion.p>
        </div>

        {/* Status / Projects Listing */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-400 py-10 text-center">{error}</div>
        ) : websites.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/40">
            <h3 className="text-xl font-semibold text-zinc-300">No websites created yet</h3>
            <p className="text-zinc-500 text-sm mt-2 mb-6">Describe your idea to generate your first website.</p>
            <button
              onClick={() => navigate("/generate")}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 font-semibold rounded-xl text-sm transition cursor-pointer"
            >
              Generate Website
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websites.map((site, index) => (
              <motion.div
                key={site._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900/90 border border-white/10 shadow-xl flex flex-col justify-between"
              >
                {/* Simulated Browser Frame Header */}
                <div className="relative w-full h-[180px] bg-black overflow-hidden border-b border-zinc-800">
                  <div className="absolute top-0 left-0 w-full h-7 bg-zinc-900 flex items-center gap-1.5 px-3 z-10 border-b border-zinc-800">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="text-[10px] text-zinc-500 ml-2 font-mono truncate max-w-[200px]">
                      {site.slug ? `site/${site.slug}` : site.title}
                    </span>
                  </div>

                  <div className="absolute top-7 left-0 w-full h-[calc(100%-28px)] overflow-hidden">
                    <iframe
                      srcDoc={site.latestcode}
                      title="Website Thumbnail Preview"
                      loading="lazy"
                      className="w-[1200px] h-[900px] scale-[0.35] origin-top-left pointer-events-none"
                    />
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white mb-1 line-clamp-1 group-hover:text-purple-400 transition">
                      {site.title || "Untitled Website"}
                    </h2>
                    <p className="text-xs text-zinc-400 mb-6">
                      Created on {new Date(site.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/editor/${site._id}`)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition cursor-pointer"
                    >
                      <FaPencilAlt size={12} />
                      <span>Edit Code</span>
                    </motion.button>

                    {!site.deployed ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                        onClick={() => handleDeployWebsite(site._id)}
                      >
                        <FaRocket size={12} />
                        <span>Deploy</span>
                      </motion.button>
                    ) : (
                      <motion.a
                        href={site.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
                      >
                        <FaExternalLinkAlt size={12} />
                        <span>View Live</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
