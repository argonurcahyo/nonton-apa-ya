import React from 'react'
import { useState, useEffect } from 'react';
import Transitions from './Transition';
import tmdb from '../apis/tmdb';
import { MovieCard } from './MovieCard';

const TopRated = () => {
    const [topRated, setTopRated] = useState([]);

    useEffect(() => {
        const fetchTopRatedMovies = async () => {
            try {
                const fetchedTopRated = await tmdb.get("movie/top_rated", {
                    params: {
                        language: "en-US",
                        region: "KR"
                    }
                });
                setTopRated(fetchedTopRated.data.results);
            } catch (error) {
                console.log(error);
                setTopRated([]);
            }
        }
        fetchTopRatedMovies();
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
                        <h1 className="heading">Top Rated</h1>
                        <div>
                            <button className="btn">
                                <i className="fas fa-sort"></i>  SORT
                            </button>
                        </div>
                    </div>
                    {topRated.length > 0 ? (
                        <div className="movie-grid">
                            {topRated.map((movie, index) => (
                                <MovieCard
                                    movie={movie}
                                    index={index}
                                    key={movie.id}
                                    type="search"
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

export default TopRated