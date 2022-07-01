import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
// import popcorn from "../img/popcorn.png";

export const Header = () => {
 const { watchlist, watched } = useContext(GlobalContext);

 return (
  <header>
   <div className="container">
    <div className="inner-content">
     <div className="brand">
      <Link to="/">{/* <img src={popcorn} alt="NontonApaYa" /> */}</Link>
     </div>

     <ul className="nav-links">
      <li>
       <Link to="/">
        {/* <i class="fa-solid fa-list"></i> */}
        WatchList
        <small>
         {watchlist.length > 0 && "  (" + watchlist.length + ")"}
        </small>
       </Link>
      </li>
      <li>
       <Link to="/watched">
        {/* <i class="fa-solid fa-circle-check"></i> */}
        Watched
        <small>
         {watched.length > 0 && "  (" + watched.length + ")"}
        </small>
       </Link>
      </li>
      <li>
       <Link to="/add" className="btn btn-main">
        <i class="fa-solid fa-plus"></i> Add
       </Link>
      </li>
     </ul>
    </div>
   </div>
  </header>
 );
};
