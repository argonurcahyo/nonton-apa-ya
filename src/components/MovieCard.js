import React, { useContext, useEffect, useState } from "react";
import { MovieControls } from "./MovieControls";
import { GlobalContext } from "../context/GlobalState";
import { motion } from "framer-motion";
import Modal from "react-modal";
import ProgressiveImage from "react-progressive-graceful-image";
import Moment from 'react-moment';
import tmdb from "../apis/tmdb";

Modal.setAppElement("#root");

export const MovieCard = ({ movie, type, index }) => {
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";
  const BASE_BD_URL = "https://image.tmdb.org/t/p/original";
  const { watchlist, watched } = useContext(GlobalContext);
  const [movieDetail, setMovieDetail] = useState("");

  useEffect(() => {
    const movieId = movie.id;
    const fetchMovieDetails = async (id) => {
      try {
        const fetchedMovieDetails = await tmdb.get(`movie/${id}`, {
          params: {
            append_to_response: "credits",
          }
        });
        setMovieDetail(fetchedMovieDetails.data);
      } catch (error) {
        setMovieDetail("");
      }

    }

    fetchMovieDetails(movieId);
  }, [movie, movieDetail]);

  //React Modal
  //---------------
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    console.log(movieDetail.credits.cast);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);
  const customStyles = {
    content: {
      top: "100px",
      left: "40%",
      right: "auto",
      bottom: "auto",
      // marginRight: "40%",
      width: "600px",
      transform: "translate(-40%, -10%)",
    },
  };
  // ---------------

  let storedMovie = watchlist.find((o) => o.id === movie.id);
  let storedMovieWatched = watched.find((o) => o.id === movie.id);

  const watchlistDisabled = storedMovie
    ? true
    : storedMovieWatched
      ? true
      : false;
  const isWatchlist = storedMovie ? true : false;
  const isWatched = storedMovieWatched ? true : false;

  return (

    <motion.div
      key={movie.id}
      initial={{
        opacity: 0,
        translateX: 0,
        translateY: 50,
      }}
      animate={{ opacity: 1, translateX: 0, translateY: 0 }}
      transition={{ duration: 0.3, delay: index * 0.2 }}
    // whileHover={{
    //   scale: 1.05,
    //   transition: { duration: 0.5, delay: 0 },
    // }}
    // whileTap={{
    //   scale: 1,
    //   transition: { delay: 0 }
    // }}
    >

      <div
        className="movie-card"
      >
        {(type === "popular" || type === "search") ?
          (isWatchlist ?
            <div class="ribbon blue"><span>WATCHLIST</span></div>
            : isWatched ?
              <div class="ribbon red"><span>WATCHED</span></div>
              : <></>)
          : <></>}

        <div
          className="overlay"
          role="button"
          onClick={handleOpenModal}
        />

        <ProgressiveImage
          src={`${BASE_IMG_URL}${movie.poster_path}`}
          // placeholder="https://placekitten.com/169/256"
          placeholder="https://icon-library.com/images/loading-icon-transparent-background/loading-icon-transparent-background-12.jpg"
        >
          {(src, loading) => (
            <img
              role="button"
              className={
                type === "popular" && watchlistDisabled ? "darken" : "able"
              }
              style={{ opacity: loading ? 0.5 : 1 }}
              src={src}
              alt={`${movie.title}`}
            />
          )}
        </ProgressiveImage>
        {((type === "popular" || type === "search") &&
          watchlistDisabled) ? <></> : <MovieControls type={type} movie={movie} />}
      </div>
      {/* React Modal */}
      {/* -------------- */}
      <Modal
        key={movie.id}
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          <h1>{movie.title}</h1>
          <button className="btn" onClick={handleCloseModal}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>
            {<Moment format="MMMM Do, YYYY">{movie.release_date}</Moment>}
          </p>

          {movieDetail && <span className="count-pill">
            {movieDetail.status}
          </span>}
        </div>

        <ProgressiveImage
          src={`${BASE_BD_URL}${movie.backdrop_path}`}
          // placeholder="https://placekitten.com/500/300"
          placeholder="https://i.pinimg.com/originals/3d/6a/a9/3d6aa9082f3c9e285df9970dc7b762ac.gif"
        >
          {(src, loading) => (
            <img
              className="detail-backdrop"
              width="100%"
              src={src}
              alt={movie.title}
              style={{ opacity: loading ? 0.5 : 1 }}
            />
          )}
        </ProgressiveImage>
        <br />

        {movieDetail && (
          <i><code>{movieDetail.tagline}</code></i>
        )}
        <p>{movie.overview}</p>
        {movieDetail && (
          <div className="cast-box">
            {movieDetail.credits.cast.slice(0, 5).map((c) =>
              <div className="profile-box" key={c.id}>
                <div className="profile">
                  <img
                    alt={c.name}
                    src={`${BASE_IMG_URL}${c.profile_path}`} />
                </div>
                <span className="actor-name">{c.name}</span>
              </div>)}
          </div>

        )}

      </Modal>
      {/* -------------- */}
    </motion.div>
  );
};
