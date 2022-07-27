import React, { useCallback, useRef, useState } from "react";
import LoadingCard from "../components/LoadingCard";
import Transitions from '../components/Transition';
import TVCard from "../components/TVCard";
import useTVPopularFetch from "../hooks/useTVPopularFetch";

const TVPopular = () => {
  const [pageNumber, setPageNumber] = useState(1)

  const {
    hasMore, loading, error, tv
  } = useTVPopularFetch(pageNumber)

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
            <h1 className="heading">Popular TV Series</h1>

          </div>
          {tv.length > 0 ? (
            <div className="movie-grid">
              {tv.map((t) => (
                <TVCard
                  ref={lastGridElementRef}
                  tv={t}
                  key={t.id}
                />
              ))}
              {loading && <LoadingCard />}
            </div>
          ) : (
            <h2 className="no-movies">Get some!</h2>
          )}
          {error && <>Error...</>}
        </div>
      </div>
    </Transitions>
  );
};

export default TVPopular