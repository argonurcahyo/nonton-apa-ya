import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Transitions from '../components/Transition';
import tmdb from '../apis/tmdb';
import TVCard from '../components/TVCard';

const TVSearch = () => {
 const [query, setQuery] = useState("");
 const [results, setResults] = useState([]);
 const [isSearching, setIsSearching] = useState(false);

 const onChange = (e) => {
  e.preventDefault();
  const value = e.target.value;
  setQuery(value);

  if (!value.trim()) {
   setResults([]);
   return;
  }

  const fetchTVSeries = async () => {
   try {
    setIsSearching(true);
    const fetchedTVSeries = await tmdb.get("search/tv", {
     params: {
      language: "en-US",
      include_adult: "true",
      query: value,
     }
    });
    setResults(fetchedTVSeries.data.results);
   } catch (error) {
    console.log(error);
    setResults([]);
   } finally {
    setIsSearching(false);
   }
  }

  fetchTVSeries();
 }

 return (
  <Transitions>
   <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     {/* Header */}
     <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 text-center"
     >
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
       <span className="gradient-secondary text-gradient">Search TV Shows</span>
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
       Find and track your favorite TV series
      </p>
     </motion.div>

     {/* Search Input */}
     <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-12 max-w-2xl mx-auto"
     >
      <div className="relative">
       <input
        type="text"
        placeholder="Search for TV shows..."
        value={query}
        onChange={onChange}
        className="input-field w-full py-4 pl-12 pr-4 text-lg"
       />
       <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
       {query && (
        <motion.button
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         onClick={() => {
          setQuery("");
          setResults([]);
         }}
         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
         <i className="fa-solid fa-times text-lg"></i>
        </motion.button>
       )}
      </div>
     </motion.div>

     {/* Results */}
     <AnimatePresence mode="wait">
      {query ? (
       isSearching ? (
        <motion.div
         key="loading"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="text-center py-12"
        >
         <i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600 dark:text-emerald-400"></i>
         <p className="text-gray-600 dark:text-gray-400 mt-4">Searching for "{query}"...</p>
        </motion.div>
       ) : results.length > 0 ? (
        <motion.div
         key="results"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
        >
         <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
           Found <span className="font-bold text-gray-900 dark:text-white">{results.length}</span> results for "{query}"
          </p>
         </div>

         <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {results.map((tv, index) => (
           <motion.div
            key={tv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
           >
            <TVCard tv={tv} index={index} />
           </motion.div>
          ))}
         </div>
        </motion.div>
       ) : (
        <motion.div
         key="no-results"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="flex items-center justify-center min-h-[400px]"
        >
         <div className="text-center">
          <i className="fa-solid fa-search text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No TV shows found</h2>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Try a different search query</p>
         </div>
        </motion.div>
       )
      ) : (
       <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
       >
        <div className="text-center">
         <i className="fa-solid fa-tv text-6xl text-gray-300 dark:text-gray-700 mb-4"></i>
         <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Start searching</h2>
         <p className="text-gray-500 dark:text-gray-500 mt-2">Type a TV show title to begin</p>
        </div>
       </motion.div>
      )}
     </AnimatePresence>
    </div>
   </main>
  </Transitions>
 )
}

export default TVSearch;