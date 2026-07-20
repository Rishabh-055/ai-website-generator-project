import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuCoins } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import LoginModal from "../components/auth/LoginModal.jsx";
import ProfileDropdown from "../components/profile/ProfileDropdown.jsx";

function Home() {
  const featureHighlights = [
    "AI Generated Codebase",
    "Fully Responsive Layouts",
    "Production Ready Delivery",
  ];

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Top Header Navigation */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div 
          className="text-2xl font-bold tracking-tight cursor-pointer"
          onClick={() => navigate("/")}
        >
          GenWeb<span className="text-purple-500">.AI</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            className="h-10 px-5 border border-gray-600 rounded-lg bg-transparent hover:border-gray-400 transition cursor-pointer"
            onClick={() => navigate("/pricing")}
          >
            Pricing
          </button>

          {user && (
            <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-black border border-orange-500/80 overflow-hidden">
              <motion.span
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-orange-500 blur-xl"
              />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="relative text-orange-400 text-xl"
              >
                <LuCoins />
              </motion.div>

              <span className="relative text-orange-300 text-sm font-semibold tracking-wide">
                Credits:
              </span>

              <motion.span
                key={user?.credit}
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.4 }}
                className="relative font-bold text-xs text-white bg-orange-600 px-3 py-0.5 rounded-full shadow-md shadow-orange-500/40"
              >
                {user?.credit}
              </motion.span>
            </div>
          )}

          {!user ? (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="h-10 px-5 font-semibold bg-purple-600 hover:bg-purple-700 transition duration-200 cursor-pointer rounded-lg shadow-lg"
            >
              Get Started
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative h-11 w-11 flex items-center justify-center cursor-pointer rounded-full"
              >
                <span className="absolute inset-0 rounded-full border-2 border-purple-500 animate-pulse pointer-events-none" />

                <img
                  className="h-9 w-9 rounded-full object-cover border border-white z-10"
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`
                  }
                  alt="Profile"
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <ProfileDropdown onClose={() => setIsProfileOpen(false)} />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center px-6 py-20 text-center max-w-4xl mx-auto">
        <h1 className="font-extrabold text-4xl sm:text-6xl tracking-tight leading-tight">
          Build Stunning Websites With
        </h1>
        <p className="font-extrabold text-3xl sm:text-5xl mt-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          GenWeb.AI
        </p>

        <p className="text-gray-400 font-light text-lg mt-6 max-w-2xl">
          Describe your business or website idea, and get a production-ready, fully responsive web application in seconds.
        </p>

        <div className="mt-8">
          {!user ? (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="h-12 px-8 font-bold bg-purple-600 hover:bg-purple-700 transition duration-200 cursor-pointer rounded-xl text-lg shadow-xl shadow-purple-600/30"
            >
              Get Started Free
            </button>
          ) : (
            <button
              className="h-12 px-8 font-bold bg-purple-600 hover:bg-purple-700 transition duration-200 cursor-pointer rounded-xl text-lg shadow-xl shadow-purple-600/30"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureHighlights.map((title, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="h-40 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col justify-center items-center text-center p-6"
            >
              <h3 className="font-semibold text-amber-300 text-lg">{title}</h3>
              <p className="text-zinc-400 text-sm mt-2">
                Generates full animated, fully responsive web applications ready for instant deployment.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm">
        <p>&copy; {new Date().getFullYear()} GenWeb.AI. All rights reserved.</p>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;
