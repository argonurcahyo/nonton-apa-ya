import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoadingCard from '../components/LoadingCard';
import MovieCard from '../components/MovieCard';
import Transitions from '../components/Transition';
import useYearFetch from '../hooks/useYearFetch';

const MovieByYear = () => {
 let { year } = useParams()
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, movies
 } = useYearFetch(year, pageNumber)

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

 useEffect(() => {
  setPageNumber(0)
  setPageNumber(1)
 }, [year])


 return (
  <Transitions>
   <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
     >
      <div className="flex items-center justify-between gap-4">
       <Link
        to={`/movie/year/${parseInt(year) - 1}`}
        className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
       >
        <i className='fa fas fa-chevron-left'></i>
        <span>{parseInt(year) - 1}</span>
       </Link>
       <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
        <span className="gradient-primary text-gradient">{year}</span>
       </h1>
       <Link
        to={`/movie/year/${parseInt(year) + 1}`}
        className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
       >
        <span>{parseInt(year) + 1}</span>
        <i className='fa fas fa-chevron-right'></i>
       </Link>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Movies released in {year}</p>
     </motion.div>

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

export default MovieByYear