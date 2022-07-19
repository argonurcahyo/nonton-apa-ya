import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdb from '../apis/tmdb'
import { MovieDetail } from './MovieDetail'

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
            console.log(movieDetail)
        } catch (error) {
            console.log(error)
            setMovieDetail("");
        }
    }

    useEffect(() => {
        fetchMovieDetails(movieId);
    }, [movieId]);

    return (
        <div className='movie-container'>
            {movieDetail && <MovieDetail movieDetail={movieDetail} />}
        </div>
    )
}

export default Movie