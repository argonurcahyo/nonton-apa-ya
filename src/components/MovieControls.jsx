import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

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
              if (sync) sync()
            }}
          >
            <i className="fa-fw far fa-eye"></i>
          </button>
          <button
            className="ctrl-btn"
            onClick={() => {
              removeMovieFromWatchlist(movie)
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
            if (sync) sync()
          }}>
            <i className="fa-fw far fa-plus"></i>
          </button>
          <button className="ctrl-btn" onClick={() => {
            // addMovieToWatchlist(movie);
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