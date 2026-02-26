import React, { useCallback, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import LoadingCard from "../components/LoadingCard";
import Transitions from '../components/Transition';
import TVCard from "../components/TVCard";
import useTVPopularFetch from "../hooks/useTVPopularFetch";

const TVPopular = () => {
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    document.title = "Popular TV Series | NontonApaYa";
  }, []);

  const {
    hasMore, loading, error, tv
  } = useTVPopularFetch(pageNumber)

  const observer = useRef()
  const lastGridElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

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
              <span className="gradient-secondary text-gradient">Popular TV Series</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Watch the most popular TV shows right now
            </p>
          </motion.div>

          {/* Content */}
          {tv.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-8">
                {tv.map((t, index) => (
                  <motion.div
                    key={t.id}
                    ref={index === tv.length - 1 ? lastGridElementRef : null}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TVCard tv={t} />
                  </motion.div>
                ))}
              </div>
              
              {/* Loading Skeleton */}
              {loading && (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <LoadingCard key={`loading-${i}`} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center">
                <i className="fa-solid fa-tv text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No TV shows found</h2>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center"
            >
              <i className="fa-solid fa-exclamation-circle text-2xl text-red-600 dark:text-red-400 mb-3 block"></i>
              <p className="text-red-700 dark:text-red-300 font-semibold">Something went wrong</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">Failed to load TV shows. Please try again.</p>
            </motion.div>
          )}
        </div>
      </main>
    </Transitions>
  );
};

export default TVPopular