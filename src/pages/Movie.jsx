import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { Link, useParams } from 'react-router-dom'
import tmdb, { BASE_IMG_URL, NO_IMG_URL, BASE_FLAG_URL } from '../apis/tmdb'
import CollectionCard from '../components/CollectionCard'
import ImageSlider from '../components/ImageSlider'
// import MovieCard from '../components/MovieCard'
import Transitions from '../components/Transition'

const Movie = () => {
  let { movieId } = useParams()
  const [movieDetail, setMovieDetail] = useState({})
  const [similar, setSimilar] = useState([])

  const fetchMovieDetails = async (id) => {
    try {
      const fetchedMovieDetails = await tmdb.get(`movie/${id}`, {
        params: {
          append_to_response: "credits,watch/providers,keywords,images,videos",
        }
      });
      setMovieDetail(fetchedMovieDetails.data);
      console.log(fetchedMovieDetails.data)
    } catch (error) {
      console.log(error)
      setMovieDetail("");
    }
  }

  const fetchSimilar = async (id) => {
    try {
      const fetchData = await tmdb.get(`movie/${id}/recommendations`);
      setSimilar(fetchData.data.results);
    } catch (error) {
      console.log(error)
      setSimilar([])
    }
  }

  useEffect(() => {
    fetchMovieDetails(movieId);
    fetchSimilar(movieId)
  }, [movieId]);

  return (
    <Transitions>
      <div className="movie-detail-page movie-page">
        <div className="container">
          {
            movieDetail && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span className="movie-title">
                    <Link to={`/movie/${movieDetail?.id}`}>{movieDetail?.title}</Link>
                  </span>

                  <div className="countries-row">
                    {movieDetail?.production_countries && (
                      movieDetail?.production_countries?.map((c, i) => (
                        <div key={i} className='country-flag'>
                          <img
                            src={c?.iso_3166_1 ? `${BASE_FLAG_URL}${c?.iso_3166_1.toLowerCase()}` : ""}
                            alt={c?.name} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span className="release-date">
                    {<Moment format="MMMM Do, YYYY">{movieDetail?.release_date}</Moment>}
                  </span>

                  {movieDetail.runtime > 0 && <span className="status-pill">
                    {movieDetail.runtime} min
                  </span>}
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: 'space-between',
                  alignItems: "center"
                }}>
                  <div className="genre-box">
                    {movieDetail.genres && (
                      movieDetail.genres.map((g, i) => (
                        <Link key={i} to={`/movie/genre/${g.id}`}>
                          <span
                            className="genre-pill"
                          >
                            {g.name}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>

                  {movieDetail["watch/providers"]?.results?.ID?.flatrate && (
                    <div className="provider-grid">
                      {movieDetail["watch/providers"]?.results?.ID?.flatrate?.map((c, i) => (
                        <div key={i}
                          className="provider-box grow">
                          <Link to={`/movie/network/${c?.provider_id}`}>
                            <img
                              alt={c?.provider_name}
                              src={`${BASE_IMG_URL}${c?.logo_path}`} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: 'space-between',
                  alignItems: "center"
                }}>
                  <span className="movie-director">
                    Directed by : <b>{movieDetail?.credits?.crew?.filter(c => c.job === "Director")?.map((dir, i) => <Link key={i} to={`/director/${dir.id}`} target="_blank">{dir.name}     </Link>)}</b>
                  </span>
                  {movieDetail.vote_average > 0 && (
                    <span className="rating">
                      {movieDetail.vote_average}
                    </span>)}
                </div>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  maxHeight: '4rem',
                  overflowY: 'auto'
                }}>
                  {movieDetail?.keywords?.keywords?.map((k, i) => (
                    <Link key={i} to={`/movie/keyword/${k.id}`}>
                      <span className="keyword-pill">
                        {k.name}
                      </span>
                    </Link>
                  ))
                  }
                </div>

                {movieDetail?.images?.backdrops && <ImageSlider images={movieDetail?.images?.backdrops?.map(im => (`${BASE_IMG_URL}${im?.file_path}`))} />}

                {/* <img
                  className="detail-backdrop"
                  width="100%"
                  src={`${BASE_IMG_URL}${movieDetail?.backdrop_path}`}
                  alt={movieDetail?.title}
                /> */}
                <div className="companies-row">
                  {movieDetail?.production_companies?.map((comp, i) => (
                    <div key={i} className="companies">
                      <Link to={`/movie/company/${comp.id}`}>
                        &copy;  {comp.name}
                      </Link>
                    </div>
                  ))}
                </div>

                {movieDetail?.tagline && (
                  <div className="tagline">
                    <i><code>"{movieDetail?.tagline}"</code></i>
                  </div>
                )}

                <p className="movie-overview">{movieDetail?.overview}</p>

                <div className="cast-grid cast-box">
                  {movieDetail?.credits?.cast?.map((c) =>
                    <div className="profile-box" key={c.id}>
                      <div className="profile grow">
                        <Link to={`/actor/${c.id}`} target="_blank">
                          <img
                            alt={c?.name}
                            src={c?.profile_path ? `${BASE_IMG_URL}${c?.profile_path}` : NO_IMG_URL} />
                        </Link>
                      </div>
                      <span className="actor-name">
                        <Link to={`/actor/${c.id}`} target="_blank">
                          {c.name}
                        </Link>
                      </span>
                      <span className="char-name" style={{ color: "gray", fontStyle: "italic" }}>
                        {c.character}
                      </span>
                    </div>)}
                </div>

                {
                  movieDetail?.belongs_to_collection && (
                    <div>
                      <h2>Collections</h2>
                      <CollectionCard id={movieDetail?.belongs_to_collection?.id} />
                    </div>
                  )
                }
                {/* 
                <h4>Similar Movies</h4>
                {similar.length > 0 ? (
                  <div className="movie-grid">
                    {similar.map((t, i) => (
                      <MovieCard
                        movie={t}
                        index={i}
                        key={t.id}
                        type="popular"
                      />
                    ))}
                  </div>
                ) : (
                  <h2 className="no-movies">None</h2>
                )} */}
              </>
            )
          }
        </div>
      </div>
    </Transitions>
  )
}

export default Movie