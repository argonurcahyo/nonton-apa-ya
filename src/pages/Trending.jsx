import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Transitions from '../components/Transition'
import MovieCard from '../components/MovieCard'
import tmdb from '../apis/tmdb'

const Trending = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  React.useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        const response = await tmdb.get('trending/movie/week', {
          params: {
            language: 'en-US',
            page: pageNumber,
          }
        });
        
        if (pageNumber === 1) {
          setMovies(response.data.results);
        } else {
          setMovies(prev => [...prev, ...response.data.results]);
        }
        
        setHasMore(pageNumber < response.data.total_pages);
        setError(false);
      } catch (err) {
        console.error('Error fetching trending movies:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, [pageNumber]);

  return (
    <Transitions>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              <span className="gradient-primary text-gradient">Trending This Week</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover the hottest movies trending right now
            </p>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">Failed to load trending movies</p>
            </motion.div>
          )}

          {/* Movies Grid */}
          {!error && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
                <AnimatePresence>
                  {movies.map((movie, index) => (
                    <motion.div
                      key={`${movie.id}-${pageNumber}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MovieCard movie={movie} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600 dark:text-emerald-400"></i>
                  <p className="text-gray-600 dark:text-gray-400 mt-4">Loading more movies...</p>
                </motion.div>
              )}

              {/* Load More Button */}
              {hasMore && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPageNumber(prev => prev + 1)}
                    className="btn-primary"
                  >
                    <i className="fa-solid fa-chevron-down mr-2"></i>
                    Load More
                  </motion.button>
                </motion.div>
              )}

              {/* No More Movies */}
              {!hasMore && movies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <p className="text-gray-500 dark:text-gray-400">No more movies to load</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </Transitions>
  )
}

export default Trending
