import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
// import popcorn from "../img/popcorn.png";

export const Header = () => {
  const { watchlist } = useContext(GlobalContext);

  return (
    <header>
      <div className="container">
        <div className="inner-content">
          <div className="brand">
            <Link to="/">{/* <img src={popcorn} alt="NontonApaYa" /> */}</Link>
          </div>

          <ul className="nav-links">
            <li>
              <Link to="/popular">Popular</Link>
            </li>
            <li>
              <Link to="/">
                WatchList
                <small>
                  {watchlist.length > 0 && "  (" + watchlist.length + ")"}
                </small>
              </Link>
            </li>
            <li>
              <Link to="/watched">Watched</Link>
            </li>
            <li>
              <Link to="/add" className="btn btn-main">
                <i className="fa-solid fa-plus"></i> Add
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
