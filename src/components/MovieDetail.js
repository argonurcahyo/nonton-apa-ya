import React from "react";

export const MovieDetail = (movie) => {
  // const BASE_IMG_URL = "https://image.tmdb.org/t/p/w200";
  console.log(movie);

  return <>
    <h1>{movie.id}</h1>
    <p>{movie.overview}</p>
  </>;
};
