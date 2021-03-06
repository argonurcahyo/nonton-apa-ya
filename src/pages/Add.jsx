import React, { useState } from "react";
import tmdb from "../apis/tmdb";
import MovieCard from "../components/MovieCard";
import Transitions from "../components/Transition";

const Add = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);


  const fetchMovies = async (q) => {
    try {
      const fetchedMovies = await tmdb.get("search/movie", {
        params: {
          language: "en-US",
          page: "1",
          include_adult: "true",
          query: q
        }
      });
      setResults(fetchedMovies.data.results);
    } catch (error) {
      console.log(error);
      setResults([])
    }
  }

  const onChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
    fetchMovies(e.target.value);
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

export default Add