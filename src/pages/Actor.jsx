import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import tmdb from '../apis/tmdb';
import useActorMovieFetch from '../hooks/useActorMovieFetch';
import MovieCard from '../components/MovieCard'
import Transitions from '../components/Transition';
import Moment from 'react-moment'

const Actor = () => {
  let { id } = useParams();
  const [actorBio, setActorBio] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/w200";
  const {
    hasMore, loading, error, movies
  } = useActorMovieFetch(id, pageNumber)

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

  const fetchActorBio = async (id) => {
    try {
      const fetchedActorBio = await tmdb.get(`person/${id}`);
      setActorBio(fetchedActorBio.data)
      console.log(fetchedActorBio.data)
    } catch (error) {
      console.log(error)
      setActorBio("");
    }
  }

  const handleClick = () => {
    console.log(movies);
  }

  useEffect(() => {
    fetchActorBio(id);
  }, [id]);

  return (
    <Transitions>
      <div className="movie-page">
        <div className="container">
          {actorBio && (
            <div>
              <div className='profile-card'>
                <h1 className="heading" onClick={handleClick}>{actorBio?.name}</h1>
                <div style={{
                  display: "flex"
                }}>
                  <div className='profile-photo' style={{ width: "20%" }}>
                    <img
                      src={`${BASE_IMG_URL}${actorBio?.profile_path}`}
                      alt={actorBio?.name}
                    />
                  </div>
                  <div style={{ padding: "0px 10px", width: "80%" }}>
                    <table>
                      <tbody>
                        <tr>
                          <td>Born</td>
                          <td>:  <Moment format="MMMM Do, YYYY">{actorBio?.birthday}</Moment></td>
                        </tr>
                        {actorBio?.deathday &&
                          <tr>
                            <td>Died</td>
                            <td>:  <Moment format="MMMM Do, YYYY">{actorBio?.deathday}</Moment></td>
                          </tr>
                        }
                        <tr>
                          <td>Place of birth</td>
                          <td>:  {actorBio?.place_of_birth}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div style={{
                      padding: ".2rem",
                      fontSize: ".8rem",
                      maxHeight: "15rem",
                      overflowY: "scroll",
                      width: "100%"
                    }}>
                      {actorBio?.biography}
                    </div>
                  </div>
                </div>
              </div>
              {error && "Error..."}
              {movies.length > 0 ? (
                <div className="movie-grid">
                  {movies?.map((movie, index) => (
                    movie.genre_ids.length > 0 && actorBio.adult === "false" ? <></> :
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

export default Actor