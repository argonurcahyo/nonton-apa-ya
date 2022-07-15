import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import tmdb from '../apis/tmdb';
import useActorMovieFetch from '../hooks/useActorMovieFetch';
import { MovieCard } from './MovieCard';
import Transitions from './Transition';

const Actor = () => {
 let { id } = useParams();
 const [actorBio, setActorBio] = useState();
 const [pageNumber, setPageNumber] = useState(1);
 const BASE_IMG_URL = "https://image.tmdb.org/t/p/w200";
 const {
  hasMore, loading, error, movies
 } = useActorMovieFetch(id, pageNumber)

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
  const fetchActorBio = async (id) => {
   try {
    const fetchedActorBio = await tmdb.get(`person/${id}`);
    setActorBio(fetchedActorBio.data);
   } catch (error) {
    console.log(error)
    setActorBio("");
   }
  }

  fetchActorBio(id);
 }, [id]);

 const handleClick = () => {
  console.log(movies);
 }

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     {actorBio && (
      <div>
       <div className='profile-card'>
        <h1 className="heading" onClick={handleClick}>{actorBio?.name}</h1>
        <div style={{
         display: "flex"
        }}>
         <div className='profile-photo'>
          <img
           src={`${BASE_IMG_URL}${actorBio?.profile_path}`}
           alt={actorBio?.name}
          />
         </div>
         <div style={{ padding: "0px 10px" }}>
          <p>Born : {actorBio.birthday}</p>
         </div>
        </div>
       </div>
       {error && "Error..."}
       {movies.length > 0 ? (
        <div className="movie-grid">
         {movies?.map((movie, index) => (
          movie.genre_ids.length > 0 && actorBio.adult === "false" ? <></> :
           <MovieCard
            ref={lastGridElementRef}
            movie={movie}
            index={index}
            key={movie.id}
            type="popular"
           />
         ))}
        </div>
       ) : (
        <h2 className="no-movies">No movies!! Get some!</h2>
       )}
      </div>
     )}
    </div>
   </div>
  </Transitions>
 )
}

export default Actor