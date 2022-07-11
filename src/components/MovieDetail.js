import React from "react";
import ReactModal from "react-modal";
import ProgressiveImage from "react-progressive-graceful-image";
import Moment from 'react-moment';

ReactModal.setAppElement("#root");

export const MovieDetail = ({ movieDetail, providers }) => {
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";
  const BASE_PRV_URL = "https://image.tmdb.org/t/p/w200";

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

          <h1>{movieDetail.title}</h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>
            {<Moment format="MMMM Do, YYYY">{movieDetail.release_date}</Moment>}
          </p>

          {movieDetail && <span className="status-pill">
            {movieDetail.status}
          </span>}
        </div>

        <div className="genre-box">
          {movieDetail && (
            movieDetail.genres.map((g) => (
              <span
                key={g.id}
                className="genre-pill">{g.name}</span>
            ))
          )}
        </div>

        <ProgressiveImage
          src={movieDetail.backdrop_path ? `${BASE_IMG_URL}${movieDetail.backdrop_path}` : "https://placekitten.com/458/305"}
          placeholder="https://i.pinimg.com/originals/3d/6a/a9/3d6aa9082f3c9e285df9970dc7b762ac.gif"
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
        {providers && (
          <div>
            <div className="provider-grid">
              {providers.flatrate?.map(c => (
                <div key={c.id} className="provider-box">
                  <img
                    alt={c.name}
                    src={`${BASE_PRV_URL}${c.logo_path}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {movieDetail && (
          <div className="tagline"><i><code>"{movieDetail.tagline}"</code></i></div>
        )}

        <p className="movie-overview">{movieDetail.overview}</p>
        {movieDetail && (
          <div className="cast-grid cast-box">
            {movieDetail.credits.cast.slice(0, 5).map((c) =>
              <div className="profile-box" key={c.id}>
                <div className="profile">
                  <img
                    alt={c.name}
                    src={`${BASE_IMG_URL}${c.profile_path}`} />
                </div>
                <span className="actor-name">{c.name}</span>
              </div>)}
          </div>

        )}
      </>
    )
  );
};
