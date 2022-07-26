import React, { useEffect, useState } from "react";
import Transitions from '../components/Transition';
import tmdb from '../apis/tmdb';
import TVCard from "../components/TVCard";

const TVPopular = () => {
  const [tvPopular, settvPopular] = useState([]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const fetchedPopulars = await tmdb.get("tv/popular", {
          params: {
            language: "en-US"
          }
        });
        console.log(fetchedPopulars);
        settvPopular(fetchedPopulars.data.results);
      } catch (error) {
        console.log(error);
        settvPopular([]);
      }
    }
    fetchPopularMovies();
  }, []);

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
          {tvPopular.length > 0 ? (
            <div className="movie-grid">
              {tvPopular.map((tv, index) => (
                <TVCard
                  tv={tv}
                  index={index}
                  key={tv.id}
                />
              ))}
            </div>
          ) : (
            <h2 className="no-movies">Get some!</h2>
          )}
        </div>
      </div>
    </Transitions>
  );
};

export default TVPopular