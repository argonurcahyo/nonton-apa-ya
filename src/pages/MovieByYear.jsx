import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingCard from '../components/LoadingCard';
import MovieCard from '../components/MovieCard';
import Transitions from '../components/Transition';
import useYearFetch from '../hooks/useYearFetch';

const MovieByYear = () => {
 let { year } = useParams()
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, movies
 } = useYearFetch(year, pageNumber)

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
 }, [year])


 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     <div style={{
      display: "flex",
      justifyContent: "space-between"
     }}>
      <button className="image-slider-btn">
       <Link to={`/movie/year/${year - 1}`}>
        <i className='fa fas fa-chevron-left'></i>
        <span className='year-slider'>{year - 1}</span>
       </Link>
      </button>
      <h1>{year}</h1>
      <button className="image-slider-btn">
       <Link to={`/movie/year/${parseInt(year) + 1}`}>
        <span className='year-slider'>{parseInt(year) + 1}</span>
        <i className='fa fas fa-chevron-right'></i>
       </Link>
      </button>
     </div>

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

export default MovieByYear