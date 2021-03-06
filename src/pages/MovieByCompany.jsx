import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import tmdb from '../apis/tmdb'
import Transitions from '../components/Transition'
import useCompanyFetch from '../hooks/useCompanyFetch'
import { BASE_IMG_URL } from '../apis/tmdb'
import MovieCard from '../components/MovieCard'
import LoadingCard from '../components/LoadingCard'

const MovieByCompany = () => {
  let { id } = useParams()
  const [company, setCompany] = useState({})
  const [pageNumber, setPageNumber] = useState(1);
  const [showShortMovies, setShowShortMovies] = useState(true);

  const {
    hasMore, loading, error, movies
  } = useCompanyFetch(id, pageNumber)

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

  const fetchCompany = async (id) => {
    try {
      const fetchedData = await tmdb.get(`company/${id}`);
      setCompany(fetchedData.data);
      console.log(fetchedData.data)
    } catch (error) {
      console.log(error);
      setCompany([]);
    }
  }

  const handleClick = () => {
    setShowShortMovies(!showShortMovies)
  }

  useEffect(() => {
    setPageNumber(0)
    setPageNumber(1)
    fetchCompany(id)
  }, [id])

  return (
    <Transitions>
      <div className="movie-page">
        <div className="container">
          {/* <h1>{company.name}</h1> */}
          <div style={{
            marginBottom: "20px",
            padding: "20px",
            display: "flex",
            justifyContent: "center"
          }}>
            <img
              style={{ width: "100%" }}
              src={`${BASE_IMG_URL}${company?.logo_path}`}
              alt={company.name} />
          </div>
          <div style={{ position: 'sticky', top: '70px', zIndex: '1000' }}>
            <button className='btn' onClick={handleClick}>
              {showShortMovies ? 'Hide' : 'Show'} Short
            </button>
          </div><br />

          {movies.length > 0 ? (
            <div className="movie-grid">
              {movies.map((movie, index) => (
                <MovieCard
                  ref={lastGridElementRef}
                  movie={movie}
                  index={index}
                  key={movie.id}
                  type="search"
                  showShortMovies={showShortMovies}
                />
              ))}
              {loading && <LoadingCard />}
            </div>
          ) : (
            <h2 className="no-movies">No movies!! Get some!</h2>
          )}
          {error && <>Error...</>}
        </div>
      </div>
    </Transitions>

  )
}

export default MovieByCompany