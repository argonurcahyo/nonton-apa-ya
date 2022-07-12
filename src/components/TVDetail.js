import React from 'react'
import ProgressiveImage from 'react-progressive-graceful-image';
import Moment from 'react-moment'

const TVDetail = ({ tvDetail }) => {
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";

  // useEffect(() => {
  //   console.log(tvDetail);
  // }, []);

  return (
    tvDetail && (
      <>
        <div style={{
          display: "flex",
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: '0px' }}>{tvDetail.name} </h1>
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
          <p style={{ margin: '5px 0px' }}>
            {<Moment format="MMMM Do, YYYY">{tvDetail.first_air_date}</Moment>}
          </p>
          <span className="season-count">{tvDetail.number_of_seasons} seasons</span>
        </div>
        <div className="genre-box">
          {tvDetail && (
            tvDetail.genres.map((g) => (
              <span
                key={g.id}
                className="genre-pill">{g.name}</span>
            ))
          )}
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

        {tvDetail && (
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
                    src={`${BASE_IMG_URL}${c.profile_path}`} />
                </div>
                <span className="actor-name">{c.name}</span>
              </div>)}
          </div>

        )}
      </>
    )
  )
}

export default TVDetail