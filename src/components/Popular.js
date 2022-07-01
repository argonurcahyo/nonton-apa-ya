import React, { useEffect, useState } from "react";
import { MovieCard } from "./MovieCard";
import Transitions from "./Transition";

export const Popular = () => {
 const [popular, setPopular] = useState([]);

 useEffect(() => {
  fetch(
   `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
  )
   .then((res) => res.json())
   .then((data) => {
    if (!data.errors) {
     setPopular(data.results);
    } else {
     setPopular([]);
    }
   });
 }, []);

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     <div className="header">
      <h1 className="heading">Popular</h1>
     </div>
     {popular.length > 0 ? (
      <div className="movie-grid">
       {popular.map((movie) => (
        <MovieCard
         movie={movie}
         key={movie.id}
         type="popular"
        />
       ))}
      </div>
     ) : (
      <h2 className="no-movies">No movies!! Get some!</h2>
     )}
    </div>
   </div>
  </Transitions>
 );
};
