import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import MovieCard from "../components/MovieCard";
import Transitions from "../components/Transition";
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '../apis/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import _ from 'lodash'
import { Link } from "react-router-dom";

const Watchlist = () => {
  const { watchlist } = useContext(GlobalContext);
  const [user] = useAuthState(auth)
  const [groupByYear, setGroupByYear] = useState(false)
  const [watchlistGroupByYear, setWatchlistGroupByYear] = useState([])

  useEffect(() => {
    const wgby = _(watchlist)
      .groupBy(w => parseInt(w.release_date))
      .map((items, year) => ({ year: year, data: items }))
      .value()
    setWatchlistGroupByYear(wgby.sort((a, b) => b.year - a.year))
  }, [watchlist]);

  return (
    <Transitions>
      <div className="movie-page">
        <div className="container">
          <div className="header">
            <h2 className="heading">
              {user ? <span style={{ textDecoration: "underline" }}>{user.email.split('@')[0]}</span> : "My"} Watchlist
            </h2>
            <span className="count-pill">
              {watchlist.length} {watchlist.length === 1 ? "Movie" : "Movies"}
            </span>
          </div>
          <div>
            {groupByYear ?
              <button className="btn" onClick={() => setGroupByYear(false)}>Show All</button>
              :
              <button className="btn" onClick={() => setGroupByYear(true)}>Group By Year</button>
            }
          </div>
          <br />

          {groupByYear ?
            watchlist.length > 0 ? (
              watchlistGroupByYear.map((wgby, i) => (
                <div key={i}>
                  <Link to={`/movie/year/${wgby.year}`}>
                    <h3 className="sticky-thc">{wgby.year}</h3>
                  </Link>

                  <motion.div layout className="movie-grid">
                    <AnimatePresence>
                      {wgby.data.map(movie => (
                        <MovieCard
                          movie={movie}
                          key={movie.id}
                          type="watchlist"
                          index={movie.id} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))
            ) : (
              <h2 className="no-movies">No movies!! Get some!</h2>
            )
            : watchlist.length > 0 ? (
              <motion.div layout className="movie-grid">
                <AnimatePresence>
                  {watchlist.map((movie, index) => (
                    <MovieCard
                      movie={movie}
                      key={movie.id}
                      type="watchlist"
                      index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <h2 className="no-movies">No movies!! Get some!</h2>
            )}
        </div>
      </div>
    </Transitions>
  );
};

export default Watchlist