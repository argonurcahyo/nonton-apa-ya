import React from "react";
import { Link } from "react-router-dom";
// import popcorn from "../img/popcorn.png";

export const Header = () => {
 return (
  <header>
   <div className="container">
    <div className="inner-content">
     <div className="brand">
      <Link to="/">
       {/* <img src={popcorn} alt="NontonApaYa" /> */}
      </Link>
     </div>

     <ul className="nav-links">
      <li>
       <Link to="/">
        {/* <i class="fa-solid fa-list"></i> */}
        WatchList
       </Link>
      </li>
      <li>
       <Link to="/watched">
        {/* <i class="fa-solid fa-circle-check"></i> */}
        Watched
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
