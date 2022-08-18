import React, { useContext, useEffect, useState } from 'react'
import tmdb, { BASE_IMG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb';
import { GlobalContext } from '../context/GlobalState';
import ImageSlider from './ImageSlider';
import TVEpisode from './TVEpisode';

const TVSeason = ({ tvId, seasonId }) => {
  let { tvWatched } = useContext(GlobalContext)
  const [tvSeason, setTvSeason] = useState({})

  const fetchTvSeason = async (tvId, seasonId) => {
    try {
      const fetchData = await tmdb.get(`tv/${tvId}/season/${seasonId}`, {
        params: {
          append_to_response: "images"
        }
      });
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
    <div style={{
      boxShadow: "0 3px 10px -5px rgba(0, 0, 0, 1)",
      padding: "1rem",
      marginBottom: ".5rem",
      borderRadius: "10px"
    }}>
      <h2 style={{ margin:".5rem 0" }}>{tvSeason?.name} </h2>
      <div style={{
        width: "100%",
        display: "block",
        height: ".8rem",
        borderRadius: "5px",
        backgroundColor: "#d8cdcd",
        marginBottom: "1rem"
      }}>
        <div style={{
          width: (tvWatched?.filter(tv => (tv.tvId === tvId && tv.seasonId === seasonId))?.length / tvSeason?.episodes?.length) * 100 + "%",
          display: "block",
          height: ".8rem",
          borderRadius: "5px",
          backgroundColor: "#0be067"
        }} />
      </div>
      <div
        className="series-overview"
        style={{ marginBottom: "10px" }}>
        {tvSeason?.overview}
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: "35%" }}>
          {/* <img
            style={{ width: "100%", borderRadius: "10px", boxShadow: "0 3px 10px -5px rgba(0, 0, 0, 1)" }}
            src={tvSeason?.poster_path ? `${BASE_IMG_URL}${tvSeason?.poster_path}` : `${NO_IMG_URL}`}
            alt={`${tvSeason?._id}`} /> */}
          {tvSeason?.images?.posters?.length > 0 ?
            <ImageSlider images={tvSeason?.images?.posters?.map(im => (`${BASE_IMG_URL}${im?.file_path}`))} />
            : <img style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} src={NO_IMG_URL_LANDSCAPE} alt="no-img" />
          }
        </div>
        <div style={{
          fontSize: ".8rem",
          width: "65%",
          padding: "0 10px",
          maxHeight: "20rem",
          overflowY: "auto"
        }}>
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