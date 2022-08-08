import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import ProgressiveImage from "react-progressive-graceful-image";
import Moment from 'react-moment';
import { BASE_IMG_URL, NO_IMG_URL } from "../apis/tmdb";

const MovieDetail = ({ movieDetail, providers }) => {
  const BASE_FLAG_URL = 'https://countryflagsapi.com/png/';
  const BD_LOADING = "https://i.pinimg.com/originals/3d/6a/a9/3d6aa9082f3c9e285df9970dc7b762ac.gif";

  const crews = movieDetail?.credits?.crew;
  const countries = movieDetail?.production_countries;
  const companies = movieDetail?.production_companies;
  const title = movieDetail?.title;
  const original_title = movieDetail?.original_title;
  const directors = crews?.filter(c => c.job === "Director");

  const navigate = useNavigate()

  return (
    movieDetail && (
      <>
        <div
          className="modal-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span className="movie-title">
            <Link to={`/movie/${movieDetail.id}`}>{title}</Link>
            {title !== original_title && (
              <span className="original-title">
                ({`${original_title}`})
              </span>
            )}
          </span>

          <div className="countries-row">
            {countries && (
              countries.map((c, i) => (
                <div key={i} className='country-flag'>
                  <img
                    src={c.iso_3166_1 ? `${BASE_FLAG_URL}${c.iso_3166_1.toLowerCase()}` : ""}
                    alt={c.name} />
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
            {<Moment format="MMMM Do, YYYY">{movieDetail.release_date}</Moment>}
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

          {providers && (
            <div className="provider-grid">
              {providers.flatrate?.map((c, i) => (
                <div key={i}
                  className="provider-box grow">
                  <Link to={`/movie/network/${c.provider_id}`}>
                    <img
                      alt={c.provider_name}
                      src={`${BASE_IMG_URL}${c.logo_path}`} />
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
            Directed by : <b>{directors.map((dir, i) => <Link key={i} to={`/director/${dir.id}`} target="_blank">{dir.name}     </Link>)}</b>

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
            <Link to={`/movie/keyword/${k.id}`}>
              <span key={i} className="keyword-pill">
                {k.name}
              </span>
            </Link>
          ))
          }
        </div>

        <ProgressiveImage
          key={movieDetail.id}
          src={movieDetail?.backdrop_path ?
            `${BASE_IMG_URL}${movieDetail?.backdrop_path}`
            : "https://placekitten.com/458/305"}
          placeholder={BD_LOADING}
        >
          {(src, loading) => (
            <img
              className="detail-backdrop"
              width="100%"
              src={src}
              alt={movieDetail.title}
              style={{ opacity: loading ? 0.5 : 1 }}
            />
          )}
        </ProgressiveImage>

        {companies && (
          <div className="companies-row">
            {companies.map((comp, i) => (
              <div key={i} className="companies">
                <Link to={`/movie/company/${comp.id}`}>
                  &copy;  {comp.name}
                </Link>
              </div>
            ))}
          </div>
        )}

        {movieDetail.tagline && (
          <div onClick={() => navigate(`/movie/${movieDetail.id}`)} className="tagline">
            <i><code>"{movieDetail.tagline}"</code></i>
          </div>
        )}

        <p className="movie-overview">{movieDetail.overview}</p>

        {movieDetail && (
          <div className="cast-grid cast-box">
            {movieDetail.credits.cast.slice(0, 10).map((c) =>
              <div className="profile-box" key={c.id}>
                <div className="profile">
                  <Link to={`/actor/${c.id}`} target="_blank">
                    <img
                      alt={c.name}
                      src={c.profile_path ? `${BASE_IMG_URL}${c?.profile_path}` : NO_IMG_URL} />
                  </Link>
                </div>
                <span className="actor-name">
                  <Link to={`/actor/${c.id}`} target="_blank">
                    {c.name}
                  </Link>

                </span>
              </div>)}
          </div>
        )}
      </>
    )
  );
};

export default MovieDetail