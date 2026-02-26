import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import tmdb from '../apis/tmdb'
import LoadingCard from '../components/LoadingCard'
import MovieCard from '../components/MovieCard'
import Transitions from '../components/Transition'
import useKeywordFetch from '../hooks/useKeywordFetch'

const MovieByKeyword = () => {
 let { id } = useParams()
 const [keyword, setKeyword] = useState({})
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, movies
 } = useKeywordFetch(id, pageNumber)

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

 const fetchKeyword = async (id) => {
  try {
   const fetchedData = await tmdb.get(`keyword/${id}`);
   setKeyword(fetchedData.data);
   console.log(fetchedData.data)
  } catch (error) {
   console.log(error);
   setKeyword([]);
  }
 }

 useEffect(() => {
  setPageNumber(0)
  setPageNumber(1)
  fetchKeyword(id)
 }, [id])

 useEffect(() => {
  if (keyword?.name) {
   document.title = `${keyword.name} - Movies | NontonApaYa`;
  }
 }, [keyword]);

 return (
  <Transitions>
   <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
     >
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
       <span className="gradient-primary text-gradient">
        {keyword?.name || 'Keyword'}
       </span>
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
       Discover movies by keyword
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

export default MovieByKeyword