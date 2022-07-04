import React from "react";
import ReactModal from "react-modal";
import ProgressiveImage from "react-progressive-graceful-image";

ReactModal.setAppElement("#root");

export const MovieDetail = (movie, show, handleClose) => {
  const BASE_BD_URL = "https://image.tmdb.org/t/p/w200";
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
  
  console.log(movie);

  return (
    <>
      {/* React Modal */}
      {/* -------------- */}
      <ReactModal
        isOpen={show}
        onRequestClose={handleClose}
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
          <button className="btn" onClick={handleClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <p>{movie.release_date}</p>

        <ProgressiveImage
          src={`${BASE_BD_URL}${movie.backdrop_path}`}
          placeholder="https://placekitten.com/500/300"
        >
          {(src) => (
            <img
              className="detail-backdrop"
              width="100%"
              src={src}
              alt={movie.title}
            />
          )}
        </ProgressiveImage>

        <p>{movie.overview}</p>
      </ReactModal>
      {/* -------------- */}
    </>
  );
};
