import React, { useEffect, useState } from 'react'
import tmdb, { BASE_IMG_URL, NO_IMG_URL } from '../apis/tmdb';
import MovieCard from './MovieCard';

const CollectionCard = ({ id }) => {
  const [collectionDetail, setCollectionDetail] = useState({})
  const [movies, setMovies] = useState([])

  const fetchCollection = async (id) => {
    try {
      const fetchData = await tmdb.get(`collection/${id}`);
      setCollectionDetail(fetchData.data);
      setMovies(fetchData.data.parts);
    } catch (error) {
      console.log(error)
      setCollectionDetail("");
    }
  }

  useEffect(() => {
    fetchCollection(id)
  }, [id]);

  return (
    <>
      <div
        className="collection movie-card"
      >
        <div className="collection-header">
          <div className="collection-name">
            {collectionDetail.name}
          </div>
          <div className="collection-overview">
            {collectionDetail.overview}
          </div>
        </div>

        <img
          alt={collectionDetail.name}
          src={collectionDetail.backdrop_path ?
            `${BASE_IMG_URL}${collectionDetail.backdrop_path}`
            : NO_IMG_URL}
        />
      </div>
      <br />
      <div className="movie-grid">
        {movies
          .sort((a, b) => (parseInt(a.release_date.slice(0, 4)) - parseInt(b.release_date.slice(0, 4))))
          .map((movie, index) => (
            <MovieCard
              movie={movie}
              index={index}
              key={movie.id}
              type="collection"
            />
          ))}
      </div>
    </>
  )
}

export default CollectionCard