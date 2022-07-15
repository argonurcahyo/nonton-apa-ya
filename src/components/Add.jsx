import React, { useState } from "react";
import tmdb from "../apis/tmdb";
// import { ResultCard } from "./ResultCard";
import { MovieCard } from "./MovieCard";
import Transitions from "./Transition";

export const Add = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const onChange = (e) => {
    e.preventDefault();

    setQuery(e.target.value);

    const fetchMovies = async () => {
      try {
        const fetchedMovies = await tmdb.get("search/movie", {
          params: {
            language: "en-US",
            page: "1",
            include_adult: "true",
            query: e.target.value
          }
        });
        setResults(fetchedMovies.data.results);
      } catch (error) {
        console.log(error);
        setResults([])
      }
    }

    fetchMovies();
  };

  return (
    <Transitions>
      <div className="add-page">
        <div className="container">
          <div className="add-content">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Search film..."
                value={query}
                onChange={onChange}
              />
            </div>
            <br />

            {/* {results.length > 0 && (
              <ul className="results">
                {results.map((movie) => (
                  <li key={movie.id}>
                    <ResultCard movie={movie} />
                  </li>
                ))}
              </ul>
            )} */}

            {results.length > 0 ? (
              <div className="movie-grid">
                {results.map((movie, index) => (
                  <MovieCard
                    movie={movie}
                    index={index}
                    key={movie.id}
                    type="search"
                  />
                ))}
              </div>
            ) : (
              <h2 className="no-movies">Search something...</h2>
            )}
          </div>
        </div>
      </div>
    </Transitions>
  );
};
