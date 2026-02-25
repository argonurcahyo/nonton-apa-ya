import React, { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalContext } from "../context/GlobalState";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../apis/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const Header = () => {
  const { watchlist } = useContext(GlobalContext);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const isMovie = !location.pathname.startsWith("/tv");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const onLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const movieLinks = [
    { to: "/movie/popular", icon: "fa-fire-flame-curved", label: "Popular" },
    { to: "/movie/watchlist", icon: "fa-list", label: "Watchlist", badge: watchlist.length },
    { to: "/movie/watched", icon: "fa-eye", label: "Watched" },
    { to: "/movie/search", icon: "fa-search", label: "Search" },
  ];

  const tvLinks = [
    { to: "/tv/popular", icon: "fa-fire-flame-curved", label: "Popular" },
    { to: "/tv/search", icon: "fa-search", label: "Search" },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Logo & Controls */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <motion.div 
              className="text-2xl font-bold gradient-primary text-gradient cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
            >
              🎬 NontonApaYa
            </motion.div>
            
            {/* Movie/TV Toggle */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 relative">
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={`absolute h-[calc(100%-8px)] rounded-lg ${
                  isMovie ? 'gradient-primary' : 'gradient-secondary'
                }`}
                style={{
                  width: "calc(50% - 4px)",
                  left: isMovie ? "4px" : "calc(50% + 2px)",
                  top: "4px",
                }}
              />
              <motion.button
                onClick={() => {
                  navigate("/movie/popular");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isMovie ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <i className="fa-solid fa-film mr-2"></i>
                MOVIES
              </motion.button>
              <motion.button
                onClick={() => {
                  navigate("/tv/popular");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  !isMovie ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <i className="fa-solid fa-tv mr-2"></i>
                TV SHOWS
              </motion.button>
            </div>
          </div>

          {/* Right Side: Navigation & Theme Toggle */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? (
                <i className="fa-solid fa-sun text-yellow-500 text-lg"></i>
              ) : (
                <i className="fa-solid fa-moon text-emerald-600 text-lg"></i>
              )}
            </motion.button>

            {/* Navigation Links */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isMovie ? "movie" : "tv"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex items-center gap-2"
              >
                {(isMovie ? movieLinks : tvLinks).map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `relative p-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`
                      }
                      title={link.label}
                    >
                      <i className={`fa-solid ${link.icon} text-lg`}></i>
                      {link.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          {link.badge}
                        </motion.span>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Logout Button */}
            {user && (
              <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                title="Logout"
              >
                <i className="fa-solid fa-power-off text-lg"></i>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;