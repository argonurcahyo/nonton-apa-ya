/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import tmdb, { BASE_IMG_URL } from '../apis/tmdb'
import Transitions from '../components/Transition'
import useNetworkFetch from '../hooks/useNetworkFetch'
import MovieCard from '../components/MovieCard'
import LoadingCard from '../components/LoadingCard'

const MovieByNetwork = () => {
 let { id } = useParams()
 const [network, setNetwork] = useState({})
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, movies
 } = useNetworkFetch(id, pageNumber)

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

 const fetchNetworkList = async () => {
  try {
   const fetchedData = await tmdb.get("watch/providers/movie");
   console.log(fetchedData.data.results.find(n => n.provider_id === parseInt(id)))
   setNetwork(fetchedData.data.results.find(n => n.provider_id === parseInt(id)))
  } catch (error) {
   console.log(error);
  }
 }

 useEffect(() => {
  fetchNetworkList()
  setPageNumber(0)
  setPageNumber(1)
 }, [id])

 useEffect(() => {
  if (network?.provider_name) {
   document.title = `${network.provider_name} Movies | NontonApaYa`;
  }
 }, [network]);

 return (
  <Transitions>
   <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
     >
      <div className="flex items-center gap-4 mb-4">
       {network?.logo_path && (
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-slate-200 dark:border-slate-700">
         <img
          src={`${BASE_IMG_URL}${network.logo_path}`}
          alt={network?.provider_name || 'Network'}
          className="w-full h-full object-contain"
         />
        </div>
       )}
       <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
         <span className="gradient-primary text-gradient">
          {network?.provider_name || 'Network'}
         </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
         Movies available on this network
        </p>
       </div>
      </div>
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

export default MovieByNetwork