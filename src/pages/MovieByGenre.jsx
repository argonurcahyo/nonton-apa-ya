import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import tmdb from '../apis/tmdb'
import useGenreFetch from '../hooks/useGenreFetch'
import Transitions from '../components/Transition';
import MovieCard from '../components/MovieCard';
import LoadingCard from '../components/LoadingCard';

const MovieByGenre = () => {
 let { id } = useParams()
 const [genres, setGenres] = useState([])
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, movies
 } = useGenreFetch(id, pageNumber)

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

 const fetchGenreList = async () => {
  try {
   const fetchedData = await tmdb.get("genre/movie/list");
   setGenres(fetchedData.data.genres);
  } catch (error) {
   console.log(error);
   setGenres([]);
  }
 }

 useEffect(() => {
  fetchGenreList()
  setPageNumber(0)
  setPageNumber(1)
 }, [id])

 useEffect(() => {
  const genreName = genres?.find(g => g.id === parseInt(id))?.name;
  if (genreName) {
   document.title = `${genreName} Movies | NontonApaYa`;
  }
 }, [genres, id]);

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
        {genres?.find(g => g.id === parseInt(id))?.name || 'Movies'}
       </span>
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
       Browse movies by genre
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

export default MovieByGenre