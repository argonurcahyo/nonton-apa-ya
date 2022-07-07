import React, { useContext, useEffect, useState } from "react";
import { MovieControls } from "./MovieControls";
import { GlobalContext } from "../context/GlobalState";
import { motion } from "framer-motion";
import Modal from "react-modal";
import ProgressiveImage from "react-progressive-graceful-image";
import Moment from 'react-moment';
import tmdb from "../apis/tmdb";
import ReactToolTip from 'react-tooltip';

Modal.setAppElement("#root");

export const MovieCard = ({ movie, type, index }) => {
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";
  const BASE_BD_URL = "https://image.tmdb.org/t/p/original";
  const BASE_PRV_URL = "https://image.tmdb.org/t/p/w200";
  const { watchlist, watched } = useContext(GlobalContext);
  const [movieDetail, setMovieDetail] = useState("");
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const movieId = movie.id;
    const fetchMovieDetails = async (id) => {
      try {
        const fetchedMovieDetails = await tmdb.get(`movie/${id}`, {
          params: {
            append_to_response: "credits, watch",
          }
        });
        setMovieDetail(fetchedMovieDetails.data);
      } catch (error) {
        setMovieDetail("");
      }

    }

    fetchMovieDetails(movieId);
  }, [movie, movieDetail]);

  useEffect(() => {
    const fetchWatchProviders = async (id) => {
      try {
        const fetchedProviders = await tmdb.get(`movie/${id}/watch/providers`);
        setProviders(fetchedProviders.data.results.ID);
      } catch (error) {
        setProviders([])
      }
    }
    movie.id && fetchWatchProviders(movie.id);
  }, [movie])

  //React Modal
  //---------------
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    console.log(providers);
    ReactToolTip.hide();
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
      width: "500px",
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

    >

      <div
        className="movie-card"
      >
        {(type === "popular" || type === "search") ?
          (isWatchlist ?
            <div className="ribbon blue"><span>WATCHLIST</span></div>
            : isWatched ?
              <div className="ribbon red"><span>WATCHED</span></div>
              : <></>)
          : <></>}

        <div
          className="overlay"
          role="button"
          data-tip={movie.title}
          data-for="tooltip"
          data-event-off='focusout'
          onClick={handleOpenModal}
        />
        <ProgressiveImage
          src={movie.poster_path ? `${BASE_IMG_URL}${movie.poster_path}` : "https://placekitten.com/141/213"}
          placeholder="https://i.stack.imgur.com/h6viz.gif"
        >
          {(src, loading) => (
            <img
              className={
                (type === "popular" || type === "search") ?
                  (isWatchlist ? "watchlist" : isWatched ? "watched" : "")
                  : ""
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
        <div className="genre-box">
          {movieDetail && (
            movieDetail.genres.map((g) => (
              <span
                key={g.id}
                className="genre-pill">{g.name}</span>
            ))
          )}
        </div>

        <ProgressiveImage
          src={movie.backdrop_path ? `${BASE_BD_URL}${movie.backdrop_path}` : "https://placekitten.com/458/305"}
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

        <p className="movie-overview">{movie.overview}</p>
        {movieDetail && (
          <div className="cast-grid cast-box">
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
        {providers && (
          <div className="modal-header">
            <div className="provider-grid">
              {providers.flatrate?.map(c => (
                <div className="provider-box">
                  <img
                    alt={c.name}
                    src={`${BASE_PRV_URL}${c.logo_path}`} />
                  {/* <span>{c.provider_name}</span> */}
                </div>
              ))}
              {providers.buy?.map(c => (
                <div className="provider-box">
                  <img
                    alt={c.name}
                    src={`${BASE_PRV_URL}${c.logo_path}`} />
                  {/* <span>{c.provider_name}</span> */}
                </div>
              ))}
              {providers.rent?.map(c => (
                <div className="provider-box">
                  <img
                    alt={c.name}
                    src={`${BASE_PRV_URL}${c.logo_path}`} />
                  {/* <span>{c.provider_name}</span> */}
                </div>
              ))}
            </div>
          </div>
        )}

      </Modal>
      {/* -------------- */}
    </motion.div>
  );
};
