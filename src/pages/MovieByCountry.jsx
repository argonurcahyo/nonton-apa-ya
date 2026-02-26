import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BASE_FLAG_URL } from '../apis/tmdb';
import LoadingCard from '../components/LoadingCard';
import MovieCard from '../components/MovieCard';
import Transitions from '../components/Transition';
import useCountryFetch from '../hooks/useCountryFetch';

const MovieByCountry = () => {
 let { country } = useParams()
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, movies
 } = useCountryFetch(country, pageNumber)

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
 }, [country])

 useEffect(() => {
  if (country) {
   document.title = `${country.toUpperCase()} Movies | NontonApaYa`;
  }
 }, [country]);

 return (
  <Transitions>
   <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
     >
      <div className="flex items-center gap-3">
       {country && (
        <img
         className="w-8 h-6 rounded-sm shadow-sm"
         src={`${BASE_FLAG_URL}${country?.toUpperCase()}/flat/64.png`}
         alt={country}
        />
       )}
       <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
        <span className="gradient-primary text-gradient">
         {country?.toUpperCase() || 'Country'}
        </span>
       </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
       Movies from this country
      </p>
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

export default MovieByCountry