import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

const MovieControls = ({ type, movie, sync }) => {
  const {
    addMovieToWatched,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    moveToWatchlist,
    removeFromWatched,
    watchlist,
    watched
  } = useContext(GlobalContext);

  const isWatchlist = !!watchlist.find((o) => o.id === movie.id);
  const isWatched = !!watched.find((o) => o.id === movie.id);

  return (
    <div className="flex gap-1.5 sm:gap-2">
      {type === "watchlist" && (
        <>
          <button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md"
            onClick={() => {
              addMovieToWatched(movie)
              if (sync) sync()
            }}
          >
            <i className="fa-solid fa-eye"></i>
            <span className="hidden sm:inline">Watched</span>
          </button>
          <button
            className="bg-slate-200 dark:bg-slate-700 hover:bg-red-500 dark:hover:bg-red-600 text-slate-700 dark:text-slate-300 hover:text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
            onClick={() => {
              removeMovieFromWatchlist(movie)
              if (sync) sync()
            }}
            title="Remove from Watchlist"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </>
      )}

      {type === "watched" && (
        <>
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md"
            onClick={() => {
              moveToWatchlist(movie)
              if (sync) sync()
            }}
          >
            <i className="fa-solid fa-bookmark"></i>
            <span className="hidden sm:inline">To Watchlist</span>
            <span className="sm:hidden">Watchlist</span>
          </button>
          <button
            className="bg-slate-200 dark:bg-slate-700 hover:bg-red-500 dark:hover:bg-red-600 text-slate-700 dark:text-slate-300 hover:text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
            onClick={() => {
              removeFromWatched(movie)
              if (sync) sync()
            }}
            title="Remove from Watched"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </>
      )}

      {(type === "search" || type === "popular" || type === "collection") && (
        <>
          {/* Show Remove button if already in watchlist */}
          {isWatchlist ? (
            <button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md"
              onClick={() => {
                removeMovieFromWatchlist(movie)
                if (sync) sync()
              }}
            >
              <i className="fa-solid fa-bookmark-slash"></i>
              <span className="hidden sm:inline">Remove</span>
            </button>
          ) : (
            <button 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md"
              onClick={() => {
                addMovieToWatchlist(movie)
                if (sync) sync()
              }}
            >
              <i className="fa-solid fa-bookmark"></i>
              <span className="hidden sm:inline">Watchlist</span>
            </button>
          )}

          {/* Show Remove button if already watched */}
          {isWatched ? (
            <button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md"
              onClick={() => {
                removeFromWatched(movie)
                if (sync) sync()
              }}
            >
              <i className="fa-solid fa-eye-slash"></i>
              <span className="hidden sm:inline">Remove</span>
            </button>
          ) : (
            <button 
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md"
              onClick={() => {
                addMovieToWatched(movie)
                if (sync) sync()
              }}
            >
              <i className="fa-solid fa-eye"></i>
              <span className="hidden sm:inline">Watched</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default MovieControls