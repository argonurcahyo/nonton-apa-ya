import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdb, { BASE_IMG_URL } from '../apis/tmdb'
import CollectionCard from '../components/CollectionCard'
import Transitions from '../components/Transition'

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
   <div className="movie-detail-page movie-page">
    <div className="container">
     {
      movieDetail && (
       <>
        <h2>
         {movieDetail.title}
        </h2>
        <img
         className="detail-backdrop"
         width="100%"
         src={`${BASE_IMG_URL}${movieDetail.backdrop_path}`}
         alt={movieDetail.title}
        />
        {
         movieDetail.belongs_to_collection && (
          <div>
           <h2>Collections</h2>
           <CollectionCard id={movieDetail?.belongs_to_collection?.id} />
          </div>
         )
        }
       </>
      )
     }
    </div>
   </div>
  </Transitions>
 )
}

export default Movie