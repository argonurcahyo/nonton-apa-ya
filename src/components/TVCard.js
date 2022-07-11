import React from 'react'
import ProgressiveImage from 'react-progressive-graceful-image'
import { useEffect, useState } from 'react';
import tmdb from "../apis/tmdb";
import Modal from './Modal';
import TVDetail from './TVDetail';

const TVCard = ({ tv, index }) => {
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";

  const [tvDetail, setTvDetail] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const onOpenModal = () => {
    setOpenModal(true);
  };
  const onCloseModal = () => setOpenModal(false);

  useEffect(() => {
    const tvId = tv.id;

    const fetchTvDetails = async (id) => {
      try {
        const fetchedTvDetails = await tmdb.get(`tv/${id}`, {
          params: {
            append_to_response: "credits",
          }
        });
        setTvDetail(fetchedTvDetails.data);
      } catch (error) {
        console.log(error);
        setTvDetail("");
      }
    }
    fetchTvDetails(tvId);
  }, [tv]);

  return (
    <div
      className="movie-card"
    >

      <div
        className="overlay"
        onClick={onOpenModal}
      />

      <Modal open={openModal} onClose={onCloseModal}>
        <TVDetail tvDetail={tvDetail} />

      </Modal>

      <ProgressiveImage
        src={tv.poster_path ? `${BASE_IMG_URL}${tv.poster_path}` : "https://placekitten.com/141/213"}
        placeholder="https://i.stack.imgur.com/h6viz.gif"
      >
        {(src, loading) => (
          <img
            style={{ opacity: loading ? 0.5 : 1 }}
            src={src}
            alt={`${tv.name}`}
          />
        )}
      </ProgressiveImage>

    </div>
  )
}

export default TVCard;