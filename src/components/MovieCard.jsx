import React, { forwardRef, useContext, useEffect, useState } from "react";
import { MovieControls } from "./MovieControls";
import { GlobalContext } from "../context/GlobalState";
import { motion } from "framer-motion";
import Modal from "./Modal";
import ProgressiveImage from "react-progressive-graceful-image";
import tmdb from "../apis/tmdb";
import { MovieDetail } from "./MovieDetail";
import TVNetworkLabel from "./TVNetworkLabel";
import Rating from "./Rating";

export const MovieCard = forwardRef(({ movie, type, index }, ref) => {
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/w200";
  const NO_IMG_URL = "https://i.mydramalist.com/ZN5Ak_4c.jpg";

  const { watchlist, watched } = useContext(GlobalContext);
  const [movieDetail, setMovieDetail] = useState("");
  const [providers, setProviders] = useState([]);

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
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
    console.log(movieDetail);
  };
  const handleCloseModal = () => setOpenModal(false);

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
    <div ref={ref}>
      <motion.div
        key={movie.id}
        initial={{
          opacity: 0,
          translateX: 0,
          translateY: 50,
        }}
        animate={{ opacity: 1, translateX: 0, translateY: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
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
            src={movie.poster_path ? `${BASE_IMG_URL}${movie.poster_path}` : NO_IMG_URL}
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

          {providers?.flatrate && (
            <TVNetworkLabel
              networks={providers.flatrate}
            />
          )}
          {(movieDetail?.vote_average && movieDetail.vote_average !== 0) ? (
            <Rating
              rating={movieDetail.vote_average}
            />
          ) : <></>}

          {((type === "popular" || type === "search") &&
            watchlistDisabled) ? <></> : <MovieControls type={type} movie={movie} />}
        </div>

        <Modal open={openModal} onClose={handleCloseModal}>
          <MovieDetail movieDetail={movieDetail} providers={providers} />
        </Modal>
      </motion.div>
    </div>
  );
}
)