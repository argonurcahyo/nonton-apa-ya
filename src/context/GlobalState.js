import React, { createContext, useEffect, useReducer } from "react";
import AppReducer from "./AppReducer";
import { ACTIONS } from "./AppReducer";
import nonton from '../apis/nonton'
import { toast } from 'react-toastify'
import { loadInitialState, persistState } from '../utils/storageHelper'
import { extractMovieData, getYear } from '../utils/dataTransformer'

const initialState = loadInitialState();

export const GlobalContext = createContext(initialState);

export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const postMovieToWatchlist = async (movie) => {
    const res = await nonton.post('/watchlist/movie', extractMovieData(movie))
    console.log(res.data)
    return res.data
  }

  const postMovieToWatched = async (movie) => {
    const res = await nonton.post('/watched/movie', extractMovieData(movie))
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
    const year = getYear(movie.release_date)
    toast.success(`You added ${movie?.title} (${year}) to watchlist!!`)
    postMovieToWatchlist(movie)
    dispatch({ type: ACTIONS.ADD_MOVIE_TO_WATCHLIST, payload: movie });
  };

  const removeMovieFromWatchlist = (movie) => {
    const year = getYear(movie.release_date)
    toast.success(`You removed ${movie?.title} (${year}) from watchlist!!`)
    deleteMovieFromWatchlist(movie.id)
    dispatch({ type: ACTIONS.REMOVE_MOVIE_FROM_WATCHLIST, payload: movie });
  };

  const addMovieToWatched = (movie) => {
    const year = getYear(movie.release_date)
    toast.success(`You've watched ${movie?.title} (${year})`)
    deleteMovieFromWatchlist(movie.id)
    postMovieToWatched(movie)
    dispatch({ type: ACTIONS.ADD_MOVIE_TO_WATCHED, payload: movie });
  };

  const moveToWatchlist = (movie) => {
    const year = getYear(movie.release_date)
    toast.info(`You moved ${movie?.title} (${year}) to watchlist!!`)
    deleteMovieFromWatched(movie.id)
    postMovieToWatchlist(movie)
    dispatch({ type: ACTIONS.MOVE_TO_WATCHLIST, payload: movie });
  };

  const removeFromWatched = (movie) => {
    const year = getYear(movie.release_date)
    toast.info(`You've not watched ${movie?.title} (${year})`)
    deleteMovieFromWatched(movie.id)
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHED, payload: movie });
  };
  // add episode to watched
  const addEpisodeToWatched = (episode) => {
    toast.info(`added!`)
    dispatch({ type: ACTIONS.ADD_EPISODE_TO_WATCHED, payload: episode })
  }


  return (
    <GlobalContext.Provider
      value={{
        watchlist: state.watchlist,
        watched: state.watched,
        tvWatched: state.tvWatched,
        addMovieToWatchlist,
        removeMovieFromWatchlist,
        addMovieToWatched,
        moveToWatchlist,
        removeFromWatched,
        addEpisodeToWatched,
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
