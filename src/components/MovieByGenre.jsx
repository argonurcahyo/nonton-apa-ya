import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import tmdb from '../apis/tmdb'
import { MovieCard } from './MovieCard'
import Transitions from './Transition'
import useGenreFetch from '../hooks/useGenreFetch'
import { useRef } from 'react'
import { useCallback } from 'react'
import LoadingCard from './LoadingCard'

const MovieByGenre = () => {
 let { id } = useParams()
 const [genres, setGenres] = useState([])
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, movies
 } = useGenreFetch(id, pageNumber)

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

 const fetchGenreList = async () => {
  try {
   const fetchedData = await tmdb.get("genre/movie/list");
   setGenres(fetchedData.data.genres);
  } catch (error) {
   console.log(error);
   setGenres([]);
  }
 }

 // const fetchMovieByGenre = async (genreId) => {
 //  try {
 //   const fetchData = await tmdb.get(`discover/movie/`, {
 //    params: {
 //     with_genres: genreId,
 //     sort_by: 'popularity.desc'
 //    }
 //   })
 //   setMovies(fetchData.data.results)
 //   console.log(fetchData.data.results)
 //  } catch (error) {
 //   console.log(error)
 //   setMovies([])
 //  }
 // }

 useEffect(() => {
  fetchGenreList()
  setPageNumber(0)
  setPageNumber(1)
  // if (id) fetchMovieByGenre(id)
 }, [id])

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     {
      genres &&
      <h3>{genres?.find(g => g.id === parseInt(id))?.name}</h3>
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
    </div>
   </div>
  </Transitions>


 )
}

export default MovieByGenre