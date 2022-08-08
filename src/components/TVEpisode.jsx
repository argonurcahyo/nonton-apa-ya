import React, { useEffect, useState } from 'react'
import tmdb, { BASE_IMG_URL } from '../apis/tmdb';

const TVEpisode = ({ tvId, seasonId, episodeId }) => {

 const [tvEpisode, setTvEpisode] = useState({})

 const fetchTvEpisode = async (tvId, seasonId, episodeId) => {
  try {
   const fetchData = await tmdb.get(`tv/${tvId}/season/${seasonId}/episode/${episodeId}`);
   setTvEpisode(fetchData.data);
  } catch (error) {
   console.log(error)
   setTvEpisode("");
  }
 }

 useEffect(() => {
  fetchTvEpisode(tvId, seasonId, episodeId);
 }, [tvId, seasonId, episodeId]);

 return (
  <div className='episode-detail'>
   <div className='episode-name'>
    S{seasonId?.toString().padStart(2, "0")}E{episodeId?.toString().padStart(2, "0")}. {tvEpisode?.name} <span className='air-date'>({tvEpisode?.air_date})</span>
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