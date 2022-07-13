import React, { useEffect, useState } from "react";
import { MovieCard } from "./MovieCard";
import Transitions from "./Transition";
import tmdb from '../apis/tmdb';
import { useSearchParams } from "react-router-dom";
import LoadingCard from "./LoadingCard";

export const Popular = () => {
  const [popular, setPopular] = useState([]);
  const [moviesReady, setMoviesReady] = useState(false);
  const [queryParams, setQueryParams] = useSearchParams();
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const fetchedPopulars = await tmdb.get("movie/popular", {
          params: {
            language: "en-US"
          }
        });
        setPopular(fetchedPopulars.data.results);
        setMoviesReady(true);
      } catch (error) {
        console.log(error);
        setPopular([]);
      }
    }
    fetchPopularMovies();
  }, []);

  useEffect(() => {
    if (!moviesReady) return;
    const sortMovies = (type) => {
      if (type === 'asc') {
        const sorted = [...popular].sort((a, b) => a.revenue - b.revenue);
        setPopular(sorted);
      }
      if (type === 'desc') {
        const sorted = [...popular].sort((a, b) => b.revenue - a.revenue);
        setPopular(sorted);
      }

    }
    sortMovies(queryParams.get('sort'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, moviesReady]);

  const setSortParam = () => {
    setSortAsc(!sortAsc);
    sortAsc ? queryParams.set("sort", "asc") : queryParams.set("sort", "desc");
    setQueryParams(queryParams);
  }

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
              <button
                className="btn"
                onClick={() => setSortParam()}>
                <i className={sortAsc ? "fas fa-sort-desc" : "fas fa-sort-asc"}></i>  SORT
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
              <LoadingCard />

            </div>
          ) : (
            <h2 className="no-movies">No movies!! Get some!</h2>
          )}
        </div>
      </div>
    </Transitions>
  );
};
