import React from 'react'
import { useParams } from 'react-router-dom'

const Movie = () => {
    let { movieId } = useParams()

    return (
        <div>Movie {movieId}</div>
    )
}

export default Movie