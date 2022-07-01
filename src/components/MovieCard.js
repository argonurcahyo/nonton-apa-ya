import React from "react";
import { MovieControls } from "./MovieControls";

export const MovieCard = ({ movie, type }) => {
 const BASE_IMG_URL = "https://image.tmdb.org/t/p/w200";
 return (
  <div className="movie-card">
   <div className="overlay"></div>
   <img
    src={`${BASE_IMG_URL}${movie.poster_path}`}
    alt={`${movie.title}`} />
   <MovieControls
    type={type}
    movie={movie} />
  </div>
 );
};
