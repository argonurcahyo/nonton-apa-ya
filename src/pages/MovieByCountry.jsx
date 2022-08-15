import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BASE_FLAG_URL } from '../apis/tmdb';
import LoadingCard from '../components/LoadingCard';
import MovieCard from '../components/MovieCard';
import Transitions from '../components/Transition';
import useCountryFetch from '../hooks/useCountryFetch';

const MovieByCountry = () => {
 let { country } = useParams()
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, movies
 } = useCountryFetch(country, pageNumber)

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

 useEffect(() => {
  setPageNumber(0)
  setPageNumber(1)
 }, [country])

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     {
      <h3><img
       style={{ height: "1rem" }}
       src={country ? `${BASE_FLAG_URL}${country?.toLowerCase()}` : ""}
       alt={country} />  {country}</h3>
     }
     {movies.length > 0 ? (
      <div className="movie-grid">
       {movies.map((movie, index) => (
        <MovieCard
         ref={lastGridElementRef}
         movie={movie}
         index={index}
         key={movie.id}
         type="search"
        />
       ))}
       {loading && <LoadingCard />}
      </div>
     ) : (
      <h2 className="no-movies">No movies!! Get some!</h2>
     )}
     {error && <>Error...</>}
    </div>
   </div>
  </Transitions>
 )
}

export default MovieByCountry