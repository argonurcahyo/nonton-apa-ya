import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import MovieCard from "../components/MovieCard";
import Transitions from "../components/Transition";
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '../apis/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import _ from 'lodash'
import { Link } from "react-router-dom";

const Watchlist = () => {
  const { watchlist } = useContext(GlobalContext);
  const [user] = useAuthState(auth)
  const [groupByYear, setGroupByYear] = useState(false)
  const [watchlistGroupByYear, setWatchlistGroupByYear] = useState([])

  useEffect(() => {
    document.title = "My Watchlist | NontonApaYa";
  }, []);

  useEffect(() => {
    const wgby = _(watchlist)
      .groupBy(w => parseInt(w.release_date))
      .map((items, year) => ({ year: year, data: items }))
      .value()
    setWatchlistGroupByYear(wgby.sort((a, b) => b.year - a.year))
  }, [watchlist]);

  return (
    <Transitions>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                <span className="gradient-primary text-gradient">
                  {user ? user.email.split('@')[0] : "My"}'s Watchlist
                </span>
              </h1>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full font-semibold"
            >
              <i className="fa-solid fa-bookmark mr-2"></i>
              {watchlist.length} {watchlist.length === 1 ? "Movie" : "Movies"}
            </motion.div>
          </motion.div>

          {/* View Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGroupByYear(!groupByYear)}
              className="btn-primary"
            >
              <i className={`fa-solid ${groupByYear ? 'fa-list' : 'fa-calendar'} mr-2`}></i>
              {groupByYear ? 'Show All' : 'Group by Year'}
            </motion.button>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {watchlist.length > 0 ? (
              <motion.div
                key={groupByYear ? 'grouped' : 'all'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {groupByYear ? (
                  <div className="space-y-12">
                    {watchlistGroupByYear.map((wgby, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Link to={`/movie/year/${wgby.year}`}>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                            <i className="fa-solid fa-calendar-days mr-2 text-emerald-600"></i>
                            {wgby.year}
                          </h2>
                        </Link>

                        <motion.div 
                          layout 
                          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                        >
                          <AnimatePresence>
                            {wgby.data.map((movie, idx) => (
                              <motion.div
                                key={movie.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <MovieCard
                                  movie={movie}
                                  type="watchlist"
                                  index={idx}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    layout 
                    className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  >
                    <AnimatePresence>
                      {watchlist.map((movie, index) => (
                        <motion.div
                          key={movie.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <MovieCard
                            movie={movie}
                            type="watchlist"
                            index={index}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-[400px]"
              >
                <div className="text-center">
                  <i className="fa-solid fa-bookmark text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
                  <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No movies in watchlist</h2>
                  <p className="text-gray-500 dark:text-gray-500 mt-2">Start adding movies to your watchlist</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </Transitions>
  );
};

export default Watchlist