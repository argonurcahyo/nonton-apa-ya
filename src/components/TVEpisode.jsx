import React, { useContext, useEffect, useState } from 'react'
import tmdb, { BASE_IMG_URL } from '../apis/tmdb';
import { GlobalContext } from '../context/GlobalState';

const TVEpisode = ({ tvId, seasonId, episodeId }) => {
  const {
    tvWatched,
    addEpisodeToWatched
  } = useContext(GlobalContext);

  const [tvEpisode, setTvEpisode] = useState({})
  let findEpisode = tvWatched?.find((o) => o?.id === tvEpisode?.id);
  const isWatched = findEpisode ? true : false;

  const fetchTvEpisode = async (tvId, seasonId, episodeId) => {
    try {
      const fetchData = await tmdb.get(`tv/${tvId}/season/${seasonId}/episode/${episodeId}`);
      setTvEpisode(fetchData.data)
    } catch (error) {
      console.log(error)
      setTvEpisode("");
    }
  }

  const handleClick = () => {
    console.log(tvEpisode)
    let episodeData = {
      tvId: tvId,
      seasonId: seasonId,
      episodeId: episodeId,
      ...tvEpisode
    }
    addEpisodeToWatched(episodeData)
    console.log(tvWatched)
  }

  useEffect(() => {
    fetchTvEpisode(tvId, seasonId, episodeId);
  }, [tvId, seasonId, episodeId]);

  useEffect(() => {
    console.log(tvWatched)
  })

  return (
    <div className='episode-detail'>
      <div style={{
        display: "flex",
      }}>
        <div style={{ marginRight: "5px" }}>
          {!isWatched ?
            <button
              onClick={handleClick}
              className='btn-tv'>
              <i className='fa fas fa-eye'></i>
            </button> :
            <button
              onClick={handleClick}
              className='btn-tv watched'>
              <i className='fa fas fa-check'></i>
            </button>
          }

        </div>
        <div className='episode-name'>
          S{seasonId?.toString().padStart(2, "0")}E{episodeId?.toString().padStart(2, "0")}. {tvEpisode?.name} <span className='air-date'>({tvEpisode?.air_date})</span>
        </div>
      </div>

      {tvEpisode?.overview &&
        <div className="episode-overview" style={{ width: "75%" }}>
          <div className="still-image">
            <img
              src={`${BASE_IMG_URL}${tvEpisode?.still_path}`}
              alt={tvEpisode?.id}
              style={{ width: "100%", borderRadius: "15px" }} />
          </div>

          {tvEpisode?.overview}
        </div>
      }
    </div>

  )
}

export default TVEpisode