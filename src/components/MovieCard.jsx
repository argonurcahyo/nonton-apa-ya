import React, { forwardRef, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { motion } from "framer-motion";
import Modal from "./Modal";
import MovieControls from "./MovieControls";
import LoadingCard from './LoadingCard'
import tmdb, { BASE_IMG_URL, NO_IMG_URL } from "../apis/tmdb";
import MovieDetail from "./MovieDetail";
import MovieNetworkLabel from "./MovieNetworkLabel";
import Rating from "./Rating";

const MovieCard = forwardRef(({ movie, type, index, showShortMovies = true, sync }, ref) => {
  const { watchlist, watched } = useContext(GlobalContext);
  const [movieDetail, setMovieDetail] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovieDetails = async (id) => {
    try {
      const fetchedMovieDetails = await tmdb.get(`movie/${id}`, {
        params: {
          append_to_response: "credits,keywords,watch/providers",
        }
      });
      setMovieDetail(fetchedMovieDetails.data);
    } catch (error) {
      setMovieDetail("");
    }
  }

  const fetchWatchProviders = async (id) => {
    try {
      const fetchedProviders = await tmdb.get(`movie/${id}/watch/providers`);
      setProviders(fetchedProviders.data.results.ID);
    } catch (error) {
      setProviders([])
    }
  }

  useEffect(() => {
    fetchMovieDetails(movie?.id);
    fetchWatchProviders(movie?.id);
  }, [movie]);

  //React Modal
  //---------------
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
    console.log(movie);
  };
  const handleCloseModal = () => setOpenModal(false);
  const imageLoaded = () => {
    setLoading(false)
  }
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
    <div
      style={{ display: movieDetail.runtime !== 0 && movieDetail.runtime <= 60 && !showShortMovies ? "none" : "block" }}
      ref={ref}>
      <motion.div
        layout
        key={movie.id}
      >
        <div
          className="movie-card"
        >
          <div
            className="short-movie-ribbon"
            style={{ display: (movieDetail?.runtime === 0 || movieDetail?.runtime > 60) ? "none" : "flex" }}
          >
            <span>short movie</span>
          </div>
          {(type === "popular" || type === "search" || type === "collection") ?
            (isWatchlist ?
              (!loading && <div className="ribbon blue"><span>WATCHLIST</span></div>)
              : isWatched ?
                (!loading && <div className="ribbon red"><span>WATCHED</span></div>)
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
          <div style={{ display: loading ? "block" : "none" }}>
            <LoadingCard />
          </div>
          <div
            style={{ display: loading ? "none" : "block" }}
          >
            <img
              className={
                (type === "popular" || type === "search") || type === "collection" ?
                  (isWatchlist ? "watchlist" : isWatched ? "watched" : "")
                  : ""
              }
              alt={movie.title}
              src={movie.poster_path ? `${BASE_IMG_URL}${movie.poster_path}` : NO_IMG_URL}
              onLoad={imageLoaded}
            />
          </div>

          {providers?.flatrate && (
            !loading && (<MovieNetworkLabel
              networks={providers.flatrate}
            />)
          )}
          {(movieDetail?.vote_average && movieDetail.vote_average !== 0) ? (
            !loading && <Rating
              rating={movieDetail.vote_average}
            />
          ) : <></>}

          {((type === "popular" || type === "search" || type === "collection") &&
            watchlistDisabled) ? <></> : !loading &&
          <MovieControls
            type={type}
            movie={movie}
            sync={sync} />
          }

          {type !== 'collection' &&
            <div style={{ display: movieDetail?.belongs_to_collection ? "block" : "none" }}>
              <div
                className="collection-ribbon">
                <span>
                  <i className="fa far fa-caret-square-right" />
                </span>
              </div>
            </div>
          }
        </div>

        <Modal key={index} open={openModal} onClose={handleCloseModal}>
          <MovieDetail movieDetail={movieDetail} providers={providers} />
        </Modal>
      </motion.div >
    </div >
  );
}
)

export default MovieCard