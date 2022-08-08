import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { toast } from 'react-toastify'

const MovieControls = ({ type, movie, sync }) => {
  const {
    addMovieToWatched,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    moveToWatchlist,
    removeFromWatched,
  } = useContext(GlobalContext);

  return (
    <div className="inner-card-controls">
      {type === "watchlist" && (
        <>
          <button
            className="ctrl-btn"
            onClick={() => {
              addMovieToWatched(movie)
              // toast(`You've watched ${movie?.title} (${movie.release_date.substr(0, 4)})`)
              if (sync) sync()
            }}
          >
            <i className="fa-fw far fa-eye"></i>
          </button>
          <button
            className="ctrl-btn"
            onClick={() => {
              removeMovieFromWatchlist(movie)
              // toast(`You removed ${movie?.title} (${movie.release_date.substr(0, 4)}) from watchlist!!`)
              if (sync) sync()
            }}
          >
            <i className="fa-fw fa fa-times"></i>
          </button>
        </>
      )}

      {type === "watched" && (
        <>
          <button
            className="ctrl-btn"
            onClick={() => {
              moveToWatchlist(movie)
              if (sync) sync()
            }}
          >
            <i className="fa-fw far fa-eye-slash"></i>
          </button>
          <button
            className="ctrl-btn"
            onClick={() => {
              removeFromWatched(movie)
              // toast(`You haven't watched ${movie?.title} (${movie.release_date.substr(0, 4)})`)
              if (sync) sync()
            }}
          >
            <i className="fa-fw fa fa-times"></i>
          </button>
        </>
      )}

      {(type === "search" || type === "popular" || type === "collection") && (
        <>
          <button className="ctrl-btn" onClick={() => {
            addMovieToWatchlist(movie)
            // toast(`You added ${movie?.title} (${movie.release_date.substr(0, 4)}) to watchlist!!`)
            if (sync) sync()
          }}>
            <i className="fa-fw far fa-plus"></i>
          </button>
          <button className="ctrl-btn" onClick={() => {
            addMovieToWatchlist(movie);
            addMovieToWatched(movie);
            if (sync) sync()
          }}>
            <i className="fa-fw far fa-eye"></i>
          </button>
        </>
      )
      }
    </div >
  );
};

export default MovieControls