import React, { useEffect, useState } from 'react'
import tmdb, { BASE_IMG_URL } from '../apis/tmdb';
import TVEpisode from './TVEpisode';

const TVSeason = ({ tvId, seasonId }) => {
 const [tvSeason, setTvSeason] = useState({})

 const fetchTvSeason = async (tvId, seasonId) => {
  try {
   const fetchData = await tmdb.get(`tv/${tvId}/season/${seasonId}`);
   setTvSeason(fetchData.data);
   console.log(fetchData.data)
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
   <h2>{tvSeason?.name}</h2>
   <div style={{ display: 'flex' }}>
    <div style={{ width: "25%" }}>
     <img style={{ width: "100%", borderRadius: "15px" }} src={`${BASE_IMG_URL}${tvSeason?.poster_path}`} alt={`${tvSeason._id}`} />
    </div>
    <div style={{ width: "75%", padding: "10px" }}>
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