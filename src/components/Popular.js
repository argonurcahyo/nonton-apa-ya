import React, { useEffect, useState } from "react";
import { MovieCard } from "./MovieCard";
import Transitions from "./Transition";
import tmdb from '../apis/tmdb';

export const Popular = () => {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const fetchedPopulars = await tmdb.get("movie/popular");
        setPopular(fetchedPopulars.data.results);
      } catch (error) {
        console.log(error);
        setPopular([]);
      }
    }
    fetchPopularMovies();
  }, []);

  return (
    <Transitions>
      
      <div className="movie-page">
        <div className="container">
          <div className="header" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <h1 className="heading">Popular</h1>
            <div>
              <button className="btn">
                <i className="fas fa-sort"></i>  SORT
              </button>
            </div>
          </div>
          {popular.length > 0 ? (
            <div className="movie-grid">
              {popular.map((movie, index) => (
                <MovieCard
                  movie={movie}
                  index={index}
                  key={movie.id}
                  type="popular"
                />
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
