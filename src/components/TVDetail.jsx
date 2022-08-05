import React from 'react'
import ProgressiveImage from 'react-progressive-graceful-image';
import Moment from 'react-moment'
import { Link } from 'react-router-dom';
import { BASE_IMG_URL, NO_IMG_URL } from '../apis/tmdb';

const TVDetail = ({ tvDetail }) => {

  return (
    tvDetail && (
      <>
        <div style={{
          display: "flex",
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3px'
        }}>
          <span className='movie-title'>
            <Link to={`/tv/${tvDetail.id}`}>
              {tvDetail.name}
            </Link>
          </span>
          <span className={`status-pill ${(tvDetail.status?.replace(/ Series/gi, "")).toLowerCase()}`}>
            <i className="status-icon"></i>
            {tvDetail.status?.replace(/ Series/gi, "")}
          </span>
        </div>
        <div style={{
          display: "flex",
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span className='release-date'>
            {<Moment format="MMMM Do, YYYY">{tvDetail.first_air_date}</Moment>} - {<Moment format="MMMM Do, YYYY">{tvDetail.last_air_date}</Moment>}
          </span>

          <span className="season-count">
            <Link to={`/tv/${tvDetail.id}`}>
              {tvDetail.number_of_seasons} seasons
            </Link>
          </span>
        </div>
        <div style={{
          display: "flex",
          justifyContent: 'space-between',
          marginBottom: "5px"

        }}>
          <div className="genre-box">
            {tvDetail && (
              tvDetail.genres.map((g, i) => (
                <Link key={i} to={`/tv/genre/${g.id}`}>
                  <span
                    className="genre-pill">
                    {g.name}
                  </span>
                </Link>
              ))
            )}
          </div>
          <div className="network-box">
            {tvDetail?.networks && (
              tvDetail.networks.map(n => (
                <div style={{ marginLeft: "2px" }} key={n.id}>
                  <Link to={`/tv/network/${n.id}`}>
                    <img
                      style={{
                        height: "10px"
                      }}
                      src={n.logo_path ? `${BASE_IMG_URL}${n.logo_path}` : ""}
                      alt={n.name} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{
          display: "flex",
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            maxHeight: '4rem',
            overflowY: 'auto'
          }}>
            {tvDetail?.keywords?.results?.map((k, i) => (
              <span key={i} className="keyword-pill">
                <Link to={`/tv/keyword/${k.id}`}>{k.name}</Link>
              </span>
            ))
            }
          </div>
        </div>

        <ProgressiveImage
          src={tvDetail.backdrop_path ? `${BASE_IMG_URL}${tvDetail.backdrop_path}` : "https://placekitten.com/458/305"}
          placeholder="https://i.pinimg.com/originals/3d/6a/a9/3d6aa9082f3c9e285df9970dc7b762ac.gif"
        >
          {(src, loading) => (
            <img
              className="detail-backdrop"
              width="100%"
              src={src}
              alt={tvDetail.title}
              style={{ opacity: loading ? 0.5 : 1 }}
            />
          )}
        </ProgressiveImage>

        {tvDetail?.production_companies && (
          <div className="companies-row">
            {tvDetail.production_companies.map((comp, i) => (
              <div key={i} className="companies">
                <Link to={`/tv/company/${comp.id}`}>
                  &copy;  {comp.name}
                </Link>
              </div>
            ))}
          </div>
        )}

        {tvDetail.tagline && (
          <div className="tagline"><i><code>"{tvDetail.tagline}"</code></i></div>
        )}

        <p className='movie-overview'>{tvDetail.overview}</p>
        {tvDetail && (
          <div className="cast-grid cast-box">
            {tvDetail.credits.cast.slice(0, 5).map((c) =>
              <div className="profile-box" key={c.id}>
                <div className="profile">
                  <img
                    alt={c.name}
                    src={c.profile_path ? `${BASE_IMG_URL}${c?.profile_path}` : NO_IMG_URL} />
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
  )
}

export default TVDetail