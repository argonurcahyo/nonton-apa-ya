import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'
import { useAuthState } from "react-firebase-hooks/auth";

export const Header = () => {
 const { watchlist } = useContext(GlobalContext);
 const activeClassname = "btn";

 const navigate = useNavigate();
 const [user] = useAuthState(auth)

 const onLogout = async () => {
  try {
   await signOut(auth)
   navigate("/login")

  } catch (error) {
   console.log(error)
  }
 }

 return (
  <header>
   <div className="container">
    <div className="inner-content">
     <ul className="nav-links">
      {/* <li>
       <NavLink
        to="/movie/toprated"
        className={({ isActive }) => isActive ? activeClassname : undefined}>
        <i className="fa fas fa-star"></i>
       </NavLink>
      </li>
      <li>
       <NavLink
        to="/movie/upcoming"
        className={({ isActive }) => isActive ? activeClassname : undefined}>
        <i className="fa fas fa-hourglass"></i>
       </NavLink>
      </li> */}
      <li>
       <NavLink
        to="/movie/popular"
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
        to="/movie/watched"
        className={({ isActive }) => isActive ? activeClassname : undefined}>
        <i className="fa fas fa-eye"></i>
       </NavLink>
      </li>
      <li>
       <NavLink
        to="/movie/search"
        className={({ isActive }) => isActive ? activeClassname : undefined}
       >
        <i className="fa-solid fa-search"></i>
       </NavLink>
      </li>
      {user &&
       <li>
        <a href="#"
         onClick={onLogout}
        >
         <i className="fa-solid fa-power-off"></i>
        </a>
       </li>
      }
      {/* <li>
       <NavLink
        to="/tv/search"
        className={({ isActive }) => isActive ? activeClassname : undefined}>
        <i className="fa fas fa-tv"></i>

       </NavLink>
      </li> */}
     </ul>
    </div>
   </div>
  </header>
 );
};
