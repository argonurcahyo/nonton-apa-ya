import React, { createContext, useEffect, useReducer } from "react";
import AppReducer from "./AppReducer";
import { ACTIONS } from "./AppReducer";
import nonton from '../apis/nonton'
import { toast } from 'react-toastify'

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
    toast.success(`You added ${movie?.title} (${movie.release_date.substr(0, 4)}) to watchlist!!`)
    postMovieToWatchlist(movie)
    dispatch({ type: ACTIONS.ADD_MOVIE_TO_WATCHLIST, payload: movie });
  };
  const removeMovieFromWatchlist = (movie) => {
    toast.success(`You removed ${movie?.title} (${movie.release_date.substr(0, 4)}) from watchlist!!`)
    deleteMovieFromWatchlist(movie.id)
    dispatch({ type: ACTIONS.REMOVE_MOVIE_FROM_WATCHLIST, payload: movie.id });
  };
  const addMovieToWatched = (movie) => {
    toast.success(`You've watched ${movie?.title} (${movie.release_date.substr(0, 4)})`)
    deleteMovieFromWatchlist(movie.id)
    postMovieToWatched(movie)
    dispatch({ type: ACTIONS.ADD_MOVIE_TO_WATCHED, payload: movie });
  };
  const moveToWatchlist = (movie) => {
    toast.info(`You moved ${movie?.title} (${movie.release_date.substr(0, 4)}) to watchlist!!`)
    deleteMovieFromWatched(movie.id)
    postMovieToWatchlist(movie)
    dispatch({ type: ACTIONS.MOVE_TO_WATCHLIST, payload: movie });
  };
  const removeFromWatched = (movie) => {
    toast.info(`You've not watched ${movie?.title} (${movie.release_date.substr(0, 4)})`)
    deleteMovieFromWatched(movie.id)
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHED, payload: movie.id });
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
