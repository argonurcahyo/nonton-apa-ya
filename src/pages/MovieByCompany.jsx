import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import tmdb from '../apis/tmdb'
import Transitions from '../components/Transition'
import useCompanyFetch from '../hooks/useCompanyFetch'
import { BASE_IMG_URL } from '../apis/tmdb'
import MovieCard from '../components/MovieCard'
import LoadingCard from '../components/LoadingCard'

const MovieByCompany = () => {
  let { id } = useParams()
  const [company, setCompany] = useState({})
  const [pageNumber, setPageNumber] = useState(1);
  const [showShortMovies, setShowShortMovies] = useState(true);

  const {
    hasMore, loading, error, movies
  } = useCompanyFetch(id, pageNumber)

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

  const fetchCompany = async (id) => {
    try {
      const fetchedData = await tmdb.get(`company/${id}`);
      setCompany(fetchedData.data);
      console.log(fetchedData.data)
    } catch (error) {
      console.log(error);
      setCompany([]);
    }
  }

  const handleClick = () => {
    setShowShortMovies(!showShortMovies)
  }

  useEffect(() => {
    setPageNumber(0)
    setPageNumber(1)
    fetchCompany(id)
  }, [id])

   return (
    <Transitions>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-4 mb-4">
              {company?.logo_path && (
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                  <img
                    className="w-full h-full object-contain"
                    src={`${BASE_IMG_URL}${company?.logo_path}`}
                    alt={company.name}
                  />
                </div>
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  <span className="gradient-primary text-gradient">
                    {company?.name || 'Company'}
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Movies from this studio
                </p>
              </div>
            </div>
          </motion.div>

          <div className="sticky top-20 z-10 mb-6">
            <button
              className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all text-sm font-semibold"
              onClick={handleClick}
            >
              {showShortMovies ? 'Hide' : 'Show'} Short Movies
            </button>
          </div>

          {movies.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-8">
                {movies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    ref={index === movies.length - 1 ? lastGridElementRef : null}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MovieCard
                      movie={movie}
                      index={index}
                      type="search"
                      showShortMovies={showShortMovies}
                    />
                  </motion.div>
                ))}
              </div>

              {loading && (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <LoadingCard key={`loading-${i}`} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-gray-600 dark:text-gray-400">No movies found.</p>
            </motion.div>
          )}
          {error && <p className="text-red-500 mt-4">Error loading movies.</p>}
        </div>
      </main>
    </Transitions>

   )
}

export default MovieByCompany