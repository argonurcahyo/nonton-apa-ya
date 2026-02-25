import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import tmdb from '../apis/tmdb';
import MovieCard from '../components/MovieCard';
import Transitions from '../components/Transition';

const Upcoming = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setLoading(true);
        const fetchedUpcoming = await tmdb.get("movie/upcoming", {
          params: {
            language: "en-US",
            region: "US"
          }
        });
        setUpcoming(fetchedUpcoming.data.results);
      } catch (error) {
        console.log(error);
        setUpcoming([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcomingMovies();
  }, []);

  return (
    <Transitions>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                <span className="gradient-primary text-gradient">Upcoming Movies</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Coming soon to theaters
              </p>
            </div>
          </motion.div>

          {/* Content */}
          {upcoming.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {upcoming.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MovieCard
                      movie={movie}
                      index={index}
                      type="popular"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div className="text-center py-12">
              <div className="inline-block">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600 dark:text-emerald-400"></i>
                <p className="text-gray-600 dark:text-gray-400 mt-4">Loading upcoming movies...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center">
                <i className="fa-solid fa-film text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No upcoming movies</h2>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </Transitions>
  )
}

export default Upcoming