import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { MovieCard } from "./MovieCard";
import Transitions from "./Transition";

import { auth } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

export const Watchlist = () => {
  const { watchlist } = useContext(GlobalContext);

  const [user] = useAuthState(auth)

  return (
    <Transitions>
      <div className="movie-page">

        <div className="container">
          <div className="header">
            <h2 className="heading">
              {user ? <span style={{ textDecoration: "underline" }}>{user.email.split('@')[0]}</span> : "My"} Watchlist
            </h2>

            <span className="count-pill">
              {watchlist.length} {watchlist.length === 1 ? "Movie" : "Movies"}
            </span>
          </div>

          {watchlist.length > 0 ? (
            <div className="movie-grid">
              {watchlist.map((movie, index) => (
                <MovieCard
                  movie={movie}
                  key={movie.id}
                  type="watchlist"
                  index={index} />
              ))}
            </div>
          ) : (
            <h2 className="no-movies">No movies!! Get some!</h2>
          )}
        </div>
      </div>
    </Transitions>
  );
};
