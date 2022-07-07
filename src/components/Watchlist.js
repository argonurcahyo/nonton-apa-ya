import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { MovieCard } from "./MovieCard";
import Transitions from "./Transition";

export const Watchlist = () => {
  const { watchlist } = useContext(GlobalContext);

  return (
    <Transitions>
      <div className="movie-page">

        <div className="container">
          <div className="header">
            <h1 className="heading">My Watchlist</h1>

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
