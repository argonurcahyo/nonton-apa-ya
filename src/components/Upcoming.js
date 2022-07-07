import React, { useEffect, useState } from 'react'
import tmdb from '../apis/tmdb';
import { MovieCard } from './MovieCard';
import Transitions from './Transition';

const Upcoming = () => {
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        const fetchedUpcoming = await tmdb.get("movie/upcoming", {
          params: {
            language: "en-US",
            region: "US"
          }
        });
        setUpcoming(fetchedUpcoming.data.results);
      } catch (error) {
        console.log(error);
        setUpcoming([]);
      }
    }
    fetchUpcomingMovies();
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
            <h1 className="heading">Upcoming</h1>
            <div>
              <button className="btn">
                <i className="fas fa-sort"></i>  SORT
              </button>
            </div>
          </div>
          {upcoming.length > 0 ? (
            <div className="movie-grid">
              {upcoming.map((movie, index) => (
                <MovieCard
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
      </div>
    </Transitions>
  )
}

export default Upcoming