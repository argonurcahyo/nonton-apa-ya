import React, { createContext, useEffect, useReducer } from "react";
import AppReducer from "./AppReducer";
import { ACTIONS } from "./AppReducer";
import nonton from '../apis/nonton'

const initialState = {
  watchlist: localStorage.getItem("watchlist")
    ? JSON.parse(localStorage.getItem("watchlist"))
    : [],
  watched: localStorage.getItem("watched")
    ? JSON.parse(localStorage.getItem("watched"))
    : []
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(state.watchlist));
    localStorage.setItem("watched", JSON.stringify(state.watched));
  }, [state]);

  const postMovieToWatchlist = async (movie) => {
    const newData = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      genre_ids: movie.genre_ids,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path
    }
    const res = await nonton.post('/watchlist/movie', newData)
    console.log(res.data)
    return res.data
  }
  const postMovieToWatched = async (movie) => {
    const newData = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      genre_ids: movie.genre_ids,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path
    }
    const res = await nonton.post('/watched/movie', newData)
    console.log(res.data)
    return res.data
  }

  const deleteMovieFromWatchlist = async (id) => {
    const res = await nonton.delete(`/watchlist/movie/${id}`)
    console.log(res.data)
    return res.data
  }
  const deleteMovieFromWatched = async (id) => {
    const res = await nonton.delete(`/watched/movie/${id}`)
    console.log(res.data)
    return res.data
  }

  const addMovieToWatchlist = (movie) => {
    postMovieToWatchlist(movie)
    dispatch({ type: ACTIONS.ADD_MOVIE_TO_WATCHLIST, payload: movie });
  };
  const removeMovieFromWatchlist = (id) => {
    deleteMovieFromWatchlist(id)
    dispatch({ type: ACTIONS.REMOVE_MOVIE_FROM_WATCHLIST, payload: id });
  };
  const addMovieToWatched = (movie) => {
    deleteMovieFromWatchlist(movie.id)
    postMovieToWatched(movie)
    dispatch({ type: ACTIONS.ADD_MOVIE_TO_WATCHED, payload: movie });
  };
  const moveToWatchlist = (movie) => {
    deleteMovieFromWatched(movie.id)
    postMovieToWatchlist(movie)
    dispatch({ type: ACTIONS.MOVE_TO_WATCHLIST, payload: movie });
  };
  const removeFromWatched = (id) => {
    deleteMovieFromWatched(id)
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHED, payload: id });
  };

  return (
    <GlobalContext.Provider
      value={{
        watchlist: state.watchlist,
        watched: state.watched,
        addMovieToWatchlist,
        removeMovieFromWatchlist,
        addMovieToWatched,
        moveToWatchlist,
        removeFromWatched,
        dbFunction: {
          postMovieToWatchlist,
          postMovieToWatched,
          deleteMovieFromWatched,
          deleteMovieFromWatchlist
        }
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
