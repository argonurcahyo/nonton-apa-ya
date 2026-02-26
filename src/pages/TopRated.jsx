import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Transitions from '../components/Transition';
import tmdb from '../apis/tmdb';
import MovieCard from '../components/MovieCard';

const TopRated = () => {
 const [topRated, setTopRated] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  document.title = "Top Rated Movies | NontonApaYa";
 }, []);

 useEffect(() => {
  const fetchTopRatedMovies = async () => {
   try {
    setLoading(true);
    const fetchedTopRated = await tmdb.get("movie/top_rated", {
     params: {
      language: "en-US",
      region: "US"
     }
    });
    setTopRated(fetchedTopRated.data.results);
   } catch (error) {
    console.log(error);
    setTopRated([]);
   } finally {
    setLoading(false);
   }
  }
  fetchTopRatedMovies();
 }, []);

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
       <span className="gradient-primary text-gradient">Top Rated Movies</span>
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
       The highest rated movies of all time
      </p>
     </motion.div>

     {/* Content */}
     {topRated.length > 0 ? (
      <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ duration: 0.3 }}
      >
       <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {topRated.map((movie, index) => (
         <motion.div
          key={movie.id}
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
      </motion.div>
     ) : loading ? (
      <motion.div className="text-center py-12">
             <div className="inline-block">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600 dark:text-emerald-400"></i>
        <p className="text-gray-600 dark:text-gray-400 mt-4">Loading top rated movies...</p>
       </div>
      </motion.div>
     ) : (
      <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       className="flex items-center justify-center min-h-[400px]"
      >
       <div className="text-center">
        <i className="fa-solid fa-star text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No top rated movies found</h2>
       </div>
      </motion.div>
     )}
    </div>
   </main>
  </Transitions>
 )
}

export default TopRated