import React, { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalContext } from "../context/GlobalState";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../apis/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Flame,
  List,
  Eye,
  Search,
  Film,
  Tv,
  Sun,
  Moon,
  Power
} from "lucide-react";

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

  const movieLinks =[
    { to: "/movie/popular", icon: Flame, label: "Popular" },
    { to: "/movie/watchlist", icon: List, label: "Watchlist", badge: watchlist.length },
    { to: "/movie/watched", icon: Eye, label: "Watched" },
    { to: "/movie/search", icon: Search, label: "Search" },
  ];

  const tvLinks =[
    { to: "/tv/popular", icon: Flame, label: "Popular" },
    { to: "/tv/search", icon: Search, label: "Search" },
  ];

  const currentLinks = isMovie ? movieLinks : tvLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP ROW: Logo, Center Toggle (Desktop), Right Actions */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <motion.div 
            className="text-xl sm:text-2xl font-black gradient-primary text-gradient cursor-pointer flex items-center gap-2 tracking-tight shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
          >
            <span className="text-2xl drop-shadow-sm">🎬</span>
            NontonApaYa
          </motion.div>
          
          {/* Center: Movie/TV Toggle (Desktop Only) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1 p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl relative shadow-inner border border-gray-200/50 dark:border-gray-700/50">
              <motion.div
                layout
                initial={false} // FIX: Prevents sliding glitch on page reload
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`absolute inset-y-1 rounded-lg shadow-sm ${
                  isMovie ? 'gradient-primary' : 'gradient-secondary'
                }`}
                style={{
                  width: "calc(50% - 4px)",
                  left: isMovie ? "4px" : "calc(50% + 4px)",
                }}
              />
              <motion.button
                onClick={() => navigate("/movie/popular")}
                className={`relative z-10 px-6 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${
                  isMovie ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Film size={16} /> MOVIES
              </motion.button>
              <motion.button
                onClick={() => navigate("/tv/popular")}
                className={`relative z-10 px-6 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${
                  !isMovie ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Tv size={16} /> TV SHOWS
              </motion.button>
            </div>
          </div>

          {/* Right Side: Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Desktop Navigation Links */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMovie ? "movie" : "tv"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex items-center gap-1 mr-2"
              >
                {currentLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                    >
                      <NavLink
                        to={link.to}
                        title={link.label}
                        className={({ isActive }) =>
                          `relative p-2.5 rounded-xl transition-all flex items-center justify-center group ${
                            isActive
                              ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400'
                          }`
                        }
                      >
                        <Icon size={20} className="transition-transform group-hover:scale-110" />
                        {link.badge > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm ring-2 ring-white dark:ring-gray-900"
                          >
                            {link.badge}
                          </motion.span>
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Theme Toggle (Mobile + Desktop) */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-emerald-500" />}
            </motion.button>

            {/* Logout Button (Mobile + Desktop) */}
            {user && (
              <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 sm:p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors shadow-sm"
                title="Logout"
              >
                <Power size={18} />
              </motion.button>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION FOR MOBILE (Toggle & Nav Links) */}
        <div className="md:hidden pb-4 space-y-3">
          
          {/* Mobile Movie/TV Toggle */}
          <div className="flex items-center p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl relative shadow-inner border border-gray-200/50 dark:border-gray-700/50 w-full">
            <motion.div
              layout
              initial={false} // FIX: Prevents sliding glitch on page reload
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`absolute inset-y-1 rounded-lg shadow-sm ${
                isMovie ? 'gradient-primary' : 'gradient-secondary'
              }`}
              style={{
                width: "calc(50% - 4px)",
                left: isMovie ? "4px" : "calc(50% + 4px)",
              }}
            />
            <button
              onClick={() => navigate("/movie/popular")}
              className={`relative z-10 flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5 ${
                isMovie ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Film size={14} /> MOVIES
            </button>
            <button
              onClick={() => navigate("/tv/popular")}
              className={`relative z-10 flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5 ${
                !isMovie ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Tv size={14} /> TV SHOWS
            </button>
          </div>

          {/* Mobile Nav Links (App-style dock) */}
          <div className="flex items-center justify-around w-full bg-gray-50 dark:bg-gray-800/40 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative flex-1 py-2 flex items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400'
                    }`
                  }
                  title={link.label}
                >
                  <Icon size={20} />
                  {link.badge > 0 && (
                    <span className="absolute top-1 right-1/4 sm:right-1/3 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;