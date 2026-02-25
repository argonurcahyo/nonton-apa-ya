import React, { forwardRef, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { motion } from "framer-motion";
import Modal from "./Modal";
import MovieControls from "./MovieControls";
import LoadingCard from './LoadingCard';
import tmdb, { BASE_IMG_URL, NO_IMG_URL } from "../apis/tmdb";
import MovieDetail from "./MovieDetail";
import MovieNetworkLabel from "./MovieNetworkLabel";

const MovieCard = forwardRef(({ movie, type, index, showShortMovies = true, sync }, ref) => {
  const { watchlist, watched } = useContext(GlobalContext);
  const [movieDetail, setMovieDetail] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovieDetails = async (id) => {
    try {
      const fetchedMovieDetails = await tmdb.get(`movie/${id}`, {
        params: {
          append_to_response: "credits,keywords,watch/providers",
        }
      });
      setMovieDetail(fetchedMovieDetails.data);
    } catch (error) {
      setMovieDetail("");
    }
  }

  const fetchWatchProviders = async (id) => {
    try {
      const fetchedProviders = await tmdb.get(`movie/${id}/watch/providers`);
      // Optional chaining just in case results.ID doesn't exist
      setProviders(fetchedProviders.data?.results?.ID ||[]);
    } catch (error) {
      setProviders([])
    }
  }

  useEffect(() => {
    if (movie?.id) {
      fetchMovieDetails(movie.id);
      fetchWatchProviders(movie.id);
    }
  },[movie]);

  // React Modal
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const imageLoaded = () => setLoading(false);

  // Status checks
  const isWatchlist = !!watchlist.find((o) => o.id === movie.id);
  const isWatched = !!watched.find((o) => o.id === movie.id);
  
  const isShortMovie = movieDetail?.runtime > 0 && movieDetail?.runtime <= 60;
  const shouldHide = isShortMovie && !showShortMovies;
  const ratingClass = (rating) => {
    if (rating >= 7) return "bg-emerald-500/90 text-white";
    if (rating >= 4) return "bg-yellow-400/90 text-slate-900";
    return "bg-red-500/90 text-white";
  };

  return (
    <div
      className={shouldHide ? "hidden" : "block"}
      ref={ref}
    >
      <motion.div
        layout
        key={movie.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {/* Card Container */}
        <div className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl ring-1 ring-slate-200 dark:ring-white/10 overflow-hidden transition-all duration-300">
          
          {/* Image & Overlay Container - Standard Movie Poster Ratio */}
          <div 
            onClick={handleOpenModal}
            className="relative aspect-[2/3] w-full cursor-pointer overflow-hidden bg-slate-200 dark:bg-slate-800"
          >
            {loading && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                <LoadingCard />
              </div>
            )}
            
            <img
              src={movie.poster_path ? `${BASE_IMG_URL}${movie.poster_path}` : NO_IMG_URL}
              alt={movie.title}
              onLoad={imageLoaded}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 cursor-pointer ${
                (isWatchlist || isWatched) ? 'opacity-70 saturate-50' : ''
              } ${loading ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Hover Play Overlay */}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-sm text-white h-14 w-14 flex items-center justify-center rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer">
                <i className="fa-solid fa-play ml-1 text-xl"></i>
              </div>
            </div>

            {/* Status Badges (Top Left) */}
            {(type === "popular" || type === "search" || type === "collection") && !loading && (
              <div className="absolute top-3 left-3 z-30 flex flex-col gap-2 pointer-events-none">
                {isWatchlist && (
                  <div className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-sm border border-white/10">
                    <i className="fa-solid fa-bookmark mr-1.5"></i> Watchlist
                  </div>
                )}
                {isWatched && (
                  <div className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-sm border border-white/10">
                    <i className="fa-solid fa-check mr-1.5"></i> Watched
                  </div>
                )}
                {isShortMovie && (
                  <div className="bg-orange-500/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-sm border border-white/10">
                    <i className="fa-solid fa-clock mr-1.5"></i> Short
                  </div>
                )}
              </div>
            )}

            {/* Network Providers (Top Right) */}
            {providers?.flatrate && !loading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MovieNetworkLabel
                  className="flex items-center gap-2"
                  networks={providers.flatrate}
                />
              </div>
            )}

            {/* Rating Badge (Bottom Right) */}
            {movieDetail?.vote_average > 0 && !loading && (
              <div className={`absolute bottom-3 right-3 z-30 flex items-center gap-1.5 backdrop-blur-md font-bold px-2.5 py-1 rounded-lg shadow-sm border border-white/10 ${ratingClass(movieDetail.vote_average)}`}>
                <i className="fa-solid fa-star text-xs"></i>
                <span className="text-sm">{movieDetail.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Desktop Card Body - Hidden by default, visible on hover */}
          <div className="hidden md:absolute md:inset-0 md:flex md:flex-col md:justify-end md:bg-gradient-to-t md:from-slate-900/95 md:to-transparent md:p-4 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300 md:z-30 md:pointer-events-none">
            <h3 
              title={movie.title}
              className="text-base font-bold text-white mb-2 cursor-pointer line-clamp-2 pointer-events-auto"
              onClick={handleOpenModal}
            >
              {movie.title}
            </h3>

            {movie.release_date && (
              <p className="text-xs text-gray-300 flex items-center gap-1.5 mb-3 pointer-events-none">
                <i className="fa-regular fa-calendar text-xs"></i>
                {new Date(movie.release_date).getFullYear()}
              </p>
            )}

            {!loading && (
              <div className="pointer-events-auto">
                <MovieControls
                  type={type}
                  movie={movie}
                  sync={sync}
                />
              </div>
            )}
          </div>

          {/* Mobile Card Body - Always visible */}
          <div className="md:hidden p-3 flex flex-col flex-grow">
            <h3 
              title={movie.title}
              className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mb-1 cursor-pointer"
              onClick={handleOpenModal}
            >
              {movie.title}
            </h3>

            {movie.release_date && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <i className="fa-regular fa-calendar text-xs"></i>
                {new Date(movie.release_date).getFullYear()}
              </p>
            )}

            <div className="mt-auto pt-2">
              {!loading && (
                <MovieControls
                  type={type}
                  movie={movie}
                  sync={sync}
                />
              )}
            </div>
          </div>
        </div>

        {/* Modal Overlay */}
        <Modal key={index} open={openModal} onClose={handleCloseModal}>
          <MovieDetail movieDetail={movieDetail} providers={providers} />
        </Modal>
      </motion.div>
    </div>
  );
});

export default MovieCard;