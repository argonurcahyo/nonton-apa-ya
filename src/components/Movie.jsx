import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdb from '../apis/tmdb'
import Transitions from './Transition'

const Movie = () => {
 let { movieId } = useParams()
 const [movieDetail, setMovieDetail] = useState({})

 const fetchMovieDetails = async (id) => {
  try {
   const fetchedMovieDetails = await tmdb.get(`movie/${id}`, {
    params: {
     append_to_response: "credits",
    }
   });
   setMovieDetail(fetchedMovieDetails.data);
   console.log(fetchedMovieDetails.data)
  } catch (error) {
   console.log(error)
   setMovieDetail("");
  }
 }

 useEffect(() => {
  fetchMovieDetails(movieId);
 }, [movieId]);

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     {
      movieDetail && (
       <>
        <h1>
         {movieDetail.title}
        </h1>
       </>
      )
     }
    </div>
   </div>
  </Transitions>
 )
}

export default Movie