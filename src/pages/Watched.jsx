import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import MovieCard from "../components/MovieCard";
import Transitions from "../components/Transition";
import { motion, AnimatePresence } from 'framer-motion'
import _ from "lodash";
import { Link } from "react-router-dom";

const Watched = () => {
  const { watched } = useContext(GlobalContext);
  const [groupByYear, setGroupByYear] = useState(false)
  const [watchedGroupByYear, setWatchedGroupByYear] = useState([])

  useEffect(() => {
    const wgby = _(watched)
      .groupBy(w => parseInt(w.release_date))
      .map((items, year) => ({ year: year, data: items }))
      .value()
    setWatchedGroupByYear(wgby.sort((a, b) => b.year - a.year))
  }, [watched]);

  return (
    <Transitions>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  <span className="gradient-primary text-gradient">Watched Movies</span>
                </h1>
              </div>
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-gradient-primary text-white px-6 py-3 rounded-full font-semibold text-lg"
              >
                {watched.length} {watched.length === 1 ? "Movie" : "Movies"}
              </motion.div>
            </div>

            {/* Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGroupByYear(!groupByYear)}
              className="btn-primary inline-block"
            >
              <i className={`fa-solid ${groupByYear ? 'fa-list' : 'fa-calendar'} mr-2`}></i>
              {groupByYear ? 'Show All' : 'Group By Year'}
            </motion.button>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {watched.length > 0 ? (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {groupByYear ? (
                  <div className="space-y-8">
                    {watchedGroupByYear.map((wgby, i) => (
                      <motion.div
                        key={wgby.year}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Link to={`/movie/year/${wgby.year}`}>
                          <motion.h2
                            whileHover={{ x: 10 }}
                            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 sticky top-24 bg-gray-50 dark:bg-gray-900 py-4 px-4 rounded-lg border-l-4 border-emerald-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <i className="fa-solid fa-calendar-days mr-2 text-emerald-600"></i>
                            {wgby.year}
                          </motion.h2>
                        </Link>
                        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                          <AnimatePresence>
                            {wgby.data.map((movie, idx) => (
                              <motion.div
                                key={movie.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <MovieCard
                                  movie={movie}
                                  type="watched"
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
                  <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    <AnimatePresence>
                      {watched.map((movie, index) => (
                        <motion.div
                          key={movie.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <MovieCard
                            movie={movie}
                            type="watched"
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
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[400px]"
              >
                <div className="text-center">
                  <i className="fa-solid fa-eye-slash text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
                  <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No movies watched yet</h2>
                  <p className="text-gray-500 dark:text-gray-500 mt-2">Start watching movies to add them here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </Transitions>
  );
};

export default Watched
