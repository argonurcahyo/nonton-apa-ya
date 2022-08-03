import React, { createContext, useEffect, useReducer } from "react";
import nonton from "../apis/nonton";
import AppReducer from "./AppReducer";
import { ACTIONS } from "./AppReducer";

const getWatchlistFromAPI = async () => {
  // try {
  //   const fetchData = await nonton.get("watchlist")
  //   if (fetchData) {
  //     return fetchData.data.data
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return []
  // }

  nonton.get("watchlist")
    .then(res => {
      console.log(res.data.data)
      return res.data.data
    })
    .catch(error => {
      console.log(error)
      return []
    })
}

const initialState = {
  watchlist: localStorage.getItem("watchlist")
    ? JSON.parse(localStorage.getItem("watchlist"))
    : [],
  watched: localStorage.getItem("watched")
    ? JSON.parse(localStorage.getItem("watched"))
    : [],
  watchlistFromAPI: getWatchlistFromAPI()
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(state.watchlist));
    localStorage.setItem("watched", JSON.stringify(state.watched));
  }, [state]);

  const addMovieToWatchlist = (movie) => {
    dispatch({ type: ACTIONS.ADD_MOVIE_TO_WATCHLIST, payload: movie });
  };
  const removeMovieFromWatchlist = (id) => {
    dispatch({ type: ACTIONS.REMOVE_MOVIE_FROM_WATCHLIST, payload: id });
  };
  const addMovieToWatched = (movie) => {
    dispatch({ type: ACTIONS.ADD_MOVIE_TO_WATCHED, payload: movie });
  };
  const moveToWatchlist = (movie) => {
    dispatch({ type: ACTIONS.MOVE_TO_WATCHLIST, payload: movie });
  };
  const removeFromWatched = (id) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHED, payload: id });
  };

  return (
    <GlobalContext.Provider
      value={{
        watchlist: state.watchlist,
        watched: state.watched,
        watchlistFromAPI: state.watchlistFromAPI,
        addMovieToWatchlist,
        removeMovieFromWatchlist,
        addMovieToWatched,
        moveToWatchlist,
        removeFromWatched,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
