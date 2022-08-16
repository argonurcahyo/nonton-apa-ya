import React from 'react'
import { BASE_IMG_URL } from '../apis/tmdb'

const TVEpisodeDetail = ({ episode }) => {
 return (
  episode && (
   <>
    <div
     className="modal-header"
     style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
     }}
    >
     <span className="modal-episode-name">
      S{episode?.season_number?.toString().padStart(2, "0")}E{episode?.episode_number?.toString().padStart(2, "0")}. {episode?.name}
     </span>
    </div>
    {episode?.overview &&
     <div className="modal-episode-overview" style={{ width: "100%" }}>
      <div className="still-image">
       <img
        src={`${BASE_IMG_URL}${episode?.still_path}`}
        alt={episode?.id}
        style={{ width: "100%", borderRadius: "10px" }} />
      </div>

      {episode?.overview}
     </div>
    }
   </>
  )
 )
}

export default TVEpisodeDetail