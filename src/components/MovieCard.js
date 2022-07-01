import React, { useContext, useState } from "react";
import { MovieControls } from "./MovieControls";
import { GlobalContext } from "../context/GlobalState";
import { motion } from "framer-motion";
import Modal from "react-modal";
import ProgressiveImage from "react-progressive-graceful-image";

Modal.setAppElement("#root");

export const MovieCard = ({ movie, type }) => {
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/w200";
  const BASE_BD_URL = "https://image.tmdb.org/t/p/original";
  const { watchlist, watched } = useContext(GlobalContext);
  //React Modal
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    console.log(movie);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);
  const customStyles = {
    content: {
      top: "20%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      width: "60%",
      transform: "translate(-40%, -10%)",
    },
  };

  let storedMovie = watchlist.find((o) => o.id === movie.id);
  let storedMovieWatched = watched.find((o) => o.id === movie.id);

  const watchlistDisabled = storedMovie
    ? true
    : storedMovieWatched
    ? true
    : false;

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.5 },
      }}
      whileTap={{ scale: 1 }}
    >
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <div
          className="header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>{movie.title}</h1>
          {/* <span className="count-pill">{movie.original_language}</span> */}
          <button className="btn" onClick={handleCloseModal}>
            <i class="fa fa-times"></i>
          </button>
        </div>

        <ProgressiveImage
          src={`${BASE_BD_URL}${movie.backdrop_path}`}
          placeholder="https://placekitten.com/500/300"
        >
          {(src) => <img width="100%" src={src} alt={movie.title} />}
        </ProgressiveImage>

        <p>{movie.overview}</p>
      </Modal>

      <div className="movie-card" role="button" onClick={handleOpenModal}>
        <div className="overlay"></div>
        <img
          role="button"
          className={
            type === "popular" && watchlistDisabled ? "darken" : "able"
          }
          style={{ pointerEvents: "auto" }}
          src={`${BASE_IMG_URL}${movie.poster_path}`}
          alt={`${movie.title}`}
        />
        <MovieControls type={type} movie={movie} />
      </div>
    </motion.div>
  );
};
