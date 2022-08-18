import React, { useEffect } from 'react'
import { BASE_IMG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb'
import ImageSlider from './ImageSlider'

const TVEpisodeDetail = ({ episode }) => {
  useEffect(() => {
    console.log(episode)
  }, [episode]);
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
            {episode?.images?.stills?.length > 0 ?
              <ImageSlider images={episode?.images?.stills?.map(im => (`${BASE_IMG_URL}${im?.file_path}`))} />
              : <img style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} src={NO_IMG_URL_LANDSCAPE} alt="no-img" />
            }

            {episode?.overview}
          </div>
        }
      </>
    )
  )
}

export default TVEpisodeDetail