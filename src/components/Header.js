import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
// import popcorn from "../img/popcorn.png";

export const Header = () => {
  const { watchlist } = useContext(GlobalContext);
  const activeClassname = "btn";

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
                to="/toprated"
                className={({ isActive }) => isActive ? activeClassname : undefined}>
                <i className="fa fas fa-star"></i>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/upcoming"
                className={({ isActive }) => isActive ? activeClassname : undefined}>
                <i className="fa fas fa-hourglass"></i>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/popular"
                className={({ isActive }) => isActive ? activeClassname : undefined}>
                <i className="fa fas fa-fire-flame-curved"></i>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? activeClassname : undefined}>
                <i className="fa fas fa-list"></i>
                {watchlist.length > 0 && (
                  <span className="header-pill">
                    {watchlist.length}
                  </span>
                )}

              </NavLink>
            </li>
            <li>
              <NavLink
                to="/watched"
                className={({ isActive }) => isActive ? activeClassname : undefined}>
                <i className="fa fas fa-eye"></i>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/add"
                // className={`btn btn-main ${({ isActive }) => isActive ? "active" : ""}}`}
                className={({ isActive }) => isActive ? activeClassname : undefined}
              >
                <i className="fa-solid fa-search"></i>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tvsearch"
                className={({ isActive }) => isActive ? activeClassname : undefined}>
                <i className="fa fas fa-tv"></i>

              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
