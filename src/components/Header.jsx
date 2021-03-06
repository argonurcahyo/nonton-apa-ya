import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { auth } from '../apis/firebase'
import { signOut } from 'firebase/auth'
import { useAuthState } from "react-firebase-hooks/auth";

const Header = ({ type = "movie" }) => {
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
        <button
         className="btn-logout"
         onClick={onLogout}
        >
         <i className="fa-solid fa-power-off"></i>
        </button>
       </li>
      }
     </ul>
    </div>
   </div>
  </header >
 );
};

export default Header