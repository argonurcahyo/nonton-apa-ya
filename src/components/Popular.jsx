import React, { useEffect, useState, useRef, useCallback } from "react";
import { MovieCard } from "./MovieCard";
import Transitions from "./Transition";
import LoadingCard from "./LoadingCard";
import usePopularFetch from "../hooks/usePopularFetch"

export const Popular = () => {
  const [pageNumber, setPageNumber] = useState(1)

  const {
    hasMore, loading, error, movies
  } = usePopularFetch(pageNumber)

  const observer = useRef()
  const lastGridElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

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

          </div>
          {movies.length > 0 ? (
            <div className="movie-grid">

              {movies.map((movie, index) => (
                <MovieCard
                  ref={lastGridElementRef}
                  movie={movie}
                  index={index}
                  key={movie.id}
                  type="popular"
                />
              ))}
              {loading && <LoadingCard />}

            </div>
          ) : (
            <h2 className="no-movies">No movies!! Get some!</h2>
          )}
        </div>
      </div>
    </Transitions>
  );
};
