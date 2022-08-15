import React, { useContext, useEffect, useState } from 'react'
import tmdb, { BASE_IMG_URL, NO_IMG_URL } from '../apis/tmdb';
import { GlobalContext } from '../context/GlobalState';
import TVEpisode from './TVEpisode';

const TVSeason = ({ tvId, seasonId }) => {
  let { tvWatched } = useContext(GlobalContext)
  const [tvSeason, setTvSeason] = useState({})

  const fetchTvSeason = async (tvId, seasonId) => {
    try {
      const fetchData = await tmdb.get(`tv/${tvId}/season/${seasonId}`);
      setTvSeason(fetchData.data);
    } catch (error) {
      console.log(error)
      setTvSeason("");
    }
  }

  useEffect(() => {
    fetchTvSeason(tvId, seasonId);
  }, [tvId, seasonId]);

  return (
    <div>
      <h2>{tvSeason?.name} </h2>

      <div style={{
        width: "100%",
        display: "block",
        height: ".8rem",
        borderRadius: "5px",
        backgroundColor: "#d8cdcd"
      }}>
        <div style={{
          width: (tvWatched?.filter(tv => (tv.tvId === tvId && tv.seasonId === seasonId))?.length / tvSeason?.episodes?.length) * 100 + "%",
          display: "block",
          height: ".8rem",
          borderRadius: "5px",
          backgroundColor: "#0be067"
        }}></div>

      </div>
      <div
        className="series-overview"
        style={{ marginBottom: "5px" }}>
        {tvSeason?.overview}
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: "25%" }}>
          <img
            style={{ width: "100%", borderRadius: "10px", boxShadow: "0 3px 10px -5px rgba(0, 0, 0, 1)" }}
            src={tvSeason?.poster_path ? `${BASE_IMG_URL}${tvSeason?.poster_path}` : `${NO_IMG_URL}`}
            alt={`${tvSeason?._id}`} />
        </div>
        <div style={{ width: "75%", padding: "0 10px" }}>
          {tvSeason?.episodes?.map((e, i) => (
            <TVEpisode
              key={i}
              tvId={tvId}
              seasonId={seasonId}
              episodeId={i + 1}
            />)
          )}
        </div>
      </div>
    </div>
  )
}

export default TVSeason