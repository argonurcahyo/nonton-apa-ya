import React, { useContext, useEffect, useState } from 'react'
import tmdb from '../apis/tmdb';
import { GlobalContext } from '../context/GlobalState';
import Modal from "./Modal";
import TVEpisodeDetail from './TVEpisodeDetail';

const TVEpisode = ({ tvId, seasonId, episodeId }) => {
  const {
    tvWatched,
    addEpisodeToWatched
  } = useContext(GlobalContext);

  const [tvEpisode, setTvEpisode] = useState({})
  const [openModal, setOpenModal] = useState(false);

  let findEpisode = tvWatched?.find((o) => o?.id === tvEpisode?.id);
  const isWatched = findEpisode ? true : false;

  const fetchTvEpisode = async (tvId, seasonId, episodeId) => {
    try {
      const fetchData = await tmdb.get(`tv/${tvId}/season/${seasonId}/episode/${episodeId}`, {
        params: {
          append_to_response: "images"
        }
      });
      setTvEpisode(fetchData.data)
    } catch (error) {
      console.log(error)
      setTvEpisode("");
    }
  }

  const handleWatchButton = () => {
    console.log(tvEpisode)
    let episodeData = {
      tvId: tvId,
      seasonId: seasonId,
      episodeId: episodeId,
      id: tvEpisode.id
    }
    addEpisodeToWatched(episodeData)
    console.log(tvWatched)
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    fetchTvEpisode(tvId, seasonId, episodeId);
  }, [tvId, seasonId, episodeId]);

  return (
    <div className='episode-detail'>
      <div style={{
        display: "flex",
      }}>
        <div style={{ marginRight: "5px" }}>
          {!isWatched ?
            <button
              onClick={handleWatchButton}
              className='btn-tv'>
              <i className='fa fas fa-eye'></i>
            </button> :
            <button
              className='btn-tv watched'>
              <i className='fa fas fa-check'></i>
            </button>
          }
        </div>
        <div className='episode-name' onClick={handleOpenModal}>
          S{seasonId?.toString().padStart(2, "0")}E{episodeId?.toString().padStart(2, "0")}. {tvEpisode?.name} <span className='air-date'>({tvEpisode?.air_date})</span>
        </div>
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <TVEpisodeDetail episode={tvEpisode} />
      </Modal>
    </div>

  )
}

export default TVEpisode