import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
// import popcorn from "../img/popcorn.png";

export const Header = () => {
  const { watchlist } = useContext(GlobalContext);

  return (
    <header>
      <div className="container">
        <div className="inner-content">
          {/* <div className="brand">
            <Link to="/">
            <img src={popcorn} alt="NontonApaYa" />
            </Link>
          </div> */}

          <ul className="nav-links">
            <li>
              <NavLink
                to="/popular"
                className={({ isActive }) => isActive ? "btn" : undefined}>
                Popular
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? "btn" : undefined}>
                WatchList
                <small>
                  {watchlist.length > 0 && "  (" + watchlist.length + ")"}
                </small>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/watched"
                className={({ isActive }) => isActive ? "btn" : undefined}>
                Watched
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/add"
                // className={`btn btn-main ${({ isActive }) => isActive ? "active" : ""}}`}
                className={({ isActive }) => isActive ? "btn" : undefined}
              >
                <i className="fa-solid fa-plus"></i> Add
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
