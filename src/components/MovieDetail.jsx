import React from "react";
import ReactModal from "react-modal";
import ProgressiveImage from "react-progressive-graceful-image";
import Moment from 'react-moment';
import { Link } from 'react-router-dom'

ReactModal.setAppElement("#root");

export const MovieDetail = ({ movieDetail, providers }) => {
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
  const BASE_PRV_URL = "https://image.tmdb.org/t/p/w200";
  const BASE_FLAG_URL = 'https://countryflagsapi.com/png/';
  const BD_LOADING = "https://i.pinimg.com/originals/3d/6a/a9/3d6aa9082f3c9e285df9970dc7b762ac.gif";

  const crews = movieDetail?.credits?.crew;
  const countries = movieDetail?.production_countries;
  const companies = movieDetail?.production_companies;
  const title = movieDetail?.title;
  const original_title = movieDetail?.original_title;
  const directors = crews?.filter(c => c.job === "Director");

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
            {title}
            {title !== original_title && (
              <span className="original-title">  ({`${original_title}`})</span>
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

          {movieDetail && <span className="status-pill">
            {movieDetail.status}
          </span>}
        </div>

        <div style={{
          display: "flex",
          justifyContent: 'space-between',
          alignItems: "center"
        }}>
          <div className="genre-box">
            {movieDetail && (
              movieDetail.genres.map((g, i) => (
                <span
                  key={i}
                  className="genre-pill">{g.name}</span>
              ))
            )}
          </div>

          {providers && (
            <div className="provider-grid">
              {providers.flatrate?.map((c, i) => (
                <div key={i} className="provider-box">
                  <img
                    alt={c.name}
                    src={`${BASE_PRV_URL}${c.logo_path}`} />
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
            Directed by : <b>{directors.map(dir => <Link to={`/actor/${dir.id}`} target="_blank">{dir.name}     </Link>)}</b>

          </span>
          <span className="rating">
            {movieDetail.vote_average}
          </span>
        </div>

        <ProgressiveImage
          key={movieDetail.id}
          src={movieDetail.backdrop_path ?
            `${BASE_IMG_URL}${movieDetail.backdrop_path}`
            // BD_LOADING
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
              <div className="companies">
                &copy;  {comp.name}
              </div>
            ))}
          </div>
        )}

        {movieDetail.tagline && (
          <div className="tagline"><i><code>"{movieDetail.tagline}"</code></i></div>
        )}

        <p className="movie-overview">{movieDetail.overview}</p>

        {movieDetail && (
          <div className="cast-grid cast-box">
            {movieDetail.credits.cast.slice(0, 5).map((c) =>
              <div className="profile-box" key={c.id}>
                <div className="profile">
                  <Link to={`/actor/${c.id}`} target="_blank">
                    <img
                      alt={c.name}
                      src={`${BASE_IMG_URL}${c.profile_path}`} />
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
