import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import tmdb, { BASE_IMG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb';
import MovieCard from './MovieCard';

const CollectionCard = ({ id }) => {
  const [collectionDetail, setCollectionDetail] = useState(null);
  const[movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollection = async (id) => {
    try {
      setLoading(true);
      const fetchData = await tmdb.get(`collection/${id}`);
      setCollectionDetail(fetchData.data);
      setMovies(fetchData.data.parts ||[]);
    } catch (error) {
      console.log(error);
      setCollectionDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCollection(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full animate-pulse">
        {/* Banner Skeleton */}
        <div className="w-full h-64 sm:h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-8"></div>
        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!collectionDetail || movies.length === 0) return null;

  // Safely sort movies by release year (handles missing dates gracefully)
  const sortedMovies = [...movies].sort((a, b) => {
    const yearA = a.release_date ? parseInt(a.release_date.substring(0, 4)) : 9999;
    const yearB = b.release_date ? parseInt(b.release_date.substring(0, 4)) : 9999;
    return yearA - yearB;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-6"
    >
      {/* 1. COLLECTION BANNER */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl mb-8 group border border-slate-200 dark:border-slate-800">
        
        {/* Backdrop Image */}
        <img
          alt={collectionDetail.name}
          src={collectionDetail.backdrop_path ? `${BASE_IMG_URL}${collectionDetail.backdrop_path}` : NO_IMG_URL_LANDSCAPE}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient Overlays for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent md:bg-gradient-to-r md:from-slate-900 md:via-slate-900/90 md:to-transparent"></div>

        {/* Banner Content */}
        <div className="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-end md:justify-center w-full md:w-3/4 lg:w-2/3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm">
              <i className="fa-solid fa-layer-group mr-1.5"></i> Movie Collection
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight leading-tight shadow-sm">
              {collectionDetail.name}
            </h2>
            {collectionDetail.overview && (
              <p className="text-sm sm:text-base text-slate-300 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-2xl">
                {collectionDetail.overview}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-400">
              <i className="fa-solid fa-film"></i>
              <span>{movies.length} Movies</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. MOVIES GRID */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <i className="fa-solid fa-clapperboard text-purple-500"></i>
          Movies in this Collection
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MovieCard
                movie={movie}
                index={index}
                type="collection"
              />
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};

export default CollectionCard;