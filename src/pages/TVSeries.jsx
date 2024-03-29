import React, { useContext, useEffect, useState } from 'react'
import Moment from 'react-moment'
import { Link, useParams } from 'react-router-dom'
import tmdb, { BASE_IMG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb'
import ImageSlider from '../components/ImageSlider'
import Transitions from '../components/Transition'
import TVCard from '../components/TVCard'
import TVSeason from '../components/TVSeason'
import { GlobalContext } from '../context/GlobalState'

const TVSeries = () => {
  let { id } = useParams()
  let { tvWatched } = useContext(GlobalContext)
  const [tvDetail, setTvDetail] = useState({})
  const [similar, setSimilar] = useState([])

  const fetchTvDetails = async (id) => {
    try {
      const fetchData = await tmdb.get(`tv/${id}`, {
        params: {
          append_to_response: "credits,keywords,images",
        }
      });
      setTvDetail(fetchData.data);
    } catch (error) {
      console.log(error)
      setTvDetail("");
    }
  }

  const fetchSimilar = async (id) => {
    try {
      const fetchData = await tmdb.get(`tv/${id}/recommendations`);
      setSimilar(fetchData.data.results);
    } catch (error) {
      console.log(error)
      setSimilar([])
    }
  }

  useEffect(() => {
    fetchTvDetails(id);
    fetchSimilar(id)
  }, [id]);

  return (
    <Transitions>
      <div className="movie-page">
        <div className="container">
          {tvDetail && (
            <>
              <div style={{
                display: "flex",
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3px'
              }}>
                <span className='movie-title'>
                  <Link to={`/tv/${tvDetail?.id}`}>
                    {tvDetail?.name}
                  </Link>
                  ({tvWatched.filter(tv => tv.tvId === id).length}/{tvDetail?.number_of_episodes})
                </span>
                <span className={`status-pill ${(tvDetail?.status?.replace(/ Series/gi, ""))?.toLowerCase()}`}>
                  <i className="status-icon"></i>
                  {tvDetail?.status?.replace(/ Series/gi, "")}
                </span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span className='release-date'>
                  {<Moment format="MMMM Do, YYYY">{tvDetail?.first_air_date}</Moment>} - {<Moment format="MMMM Do, YYYY">{tvDetail?.last_air_date}</Moment>}
                </span>

                <span className="season-count">
                  <Link to={`/tv/${tvDetail?.id}`}>
                    {tvDetail?.number_of_seasons} seasons
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
                    tvDetail?.genres?.map((g, i) => (
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
                    tvDetail?.networks?.map(n => (
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
              {tvDetail?.images?.backdrops?.length > 0 ?
                <ImageSlider images={tvDetail?.images?.backdrops?.map(im => (`${BASE_IMG_URL}${im?.file_path}`))} />
                : <img style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} src={NO_IMG_URL_LANDSCAPE} alt="no-img" />
              }

              <div className='tv-overview' style={{ margin: '10px 0' }}>
                {tvDetail?.overview}
              </div>

              <div>
                {tvDetail?.seasons?.map((s, i) => (
                  <div key={i}>
                    <TVSeason tvId={id} seasonId={s?.season_number} />
                  </div>
                ))}
              </div>

              {similar.length > 0 && (
                <>
                  <h4>Similar TV Series</h4>
                  <div className="movie-grid">
                    {similar.map((t) => (
                      <TVCard
                        tv={t}
                        key={t.id}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Transitions>
  )
}

export default TVSeries