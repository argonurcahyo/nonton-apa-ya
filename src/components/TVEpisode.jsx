import React, { useEffect, useState } from 'react'
import tmdb from '../apis/tmdb';

const TVEpisode = ({ tvId, seasonId, episodeId }) => {

 const [tvEpisode, setTvEpisode] = useState({})

 const fetchTvEpisode = async (tvId, seasonId, episodeId) => {
  try {
   const fetchData = await tmdb.get(`tv/${tvId}/season/${seasonId}/episode/${episodeId}`);
   setTvEpisode(fetchData.data);
   // console.log(fetchData.data)
  } catch (error) {
   console.log(error)
   setTvEpisode("");
  }
 }

 useEffect(() => {
  fetchTvEpisode(tvId, seasonId, episodeId);
 }, [tvId, seasonId, episodeId]);

 return (
  <div>
   S{seasonId.toString().padStart(2, "0")}E{episodeId.toString().padStart(2, "0")}. {tvEpisode.name}
   {/* <img src={`${BASE_IMG_URL}${tvEpisode.still_path}`} alt={tvEpisode.id} /> */}
  </div>
 )
}

export default TVEpisode