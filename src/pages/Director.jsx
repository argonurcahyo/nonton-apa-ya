import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import tmdb, { BASE_IMG_URL } from '../apis/tmdb';
import useDirectorMovieFetch from '../hooks/useDirectorMovieFetch';
import Transitions from '../components/Transition'
import MovieCard from '../components/MovieCard';

const Director = () => {
  let { id } = useParams();
  const [directorBio, setDirectorBio] = useState({})
  const [pageNumber, setPageNumber] = useState(1);
  const {
    hasMore, loading, error, movies
  } = useDirectorMovieFetch(id, pageNumber)

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

  const fetchDirectorBio = async (id) => {
    try {
      const fetchedData = await tmdb.get(`person/${id}`);
      setDirectorBio(fetchedData.data);
      console.log(fetchedData.data)
    } catch (error) {
      console.log(error)
      setDirectorBio({})
    }
  }

  useEffect(() => {
    fetchDirectorBio(id)
  }, [id])

  return (
    <Transitions>
      <div className="movie-page">
        <div className="container">
          {directorBio && (
            <div>
              <div className='profile-card'>
                <h1 className="heading">{directorBio?.name}</h1>
                <div style={{
                  display: "flex"
                }}>
                  <div className='profile-photo'>
                    <img
                      src={`${BASE_IMG_URL}${directorBio?.profile_path}`}
                      alt={directorBio?.name}
                    />
                  </div>
                  <div style={{ padding: "0px 10px" }}>
                    <p>Born : {directorBio.birthday}</p>
                  </div>
                </div>
              </div>
              {error && "Error..."}
              {movies.length > 0 ? (
                <div className="movie-grid">
                  {movies?.map((movie, index) => (
                    movie.genre_ids.length > 0 && directorBio.adult === "false" ? <></> :
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

export default Director