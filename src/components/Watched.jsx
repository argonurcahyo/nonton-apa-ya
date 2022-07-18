import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { MovieCard } from "./MovieCard";
import Transitions from "./Transition";
import { motion, AnimatePresence } from 'framer-motion'
import _ from "lodash";

export const Watched = () => {
  const { watched } = useContext(GlobalContext);
  const [groupByYear, setGroupByYear] = useState(false)
  const [watchedGroupByYear, setWatchedGroupByYear] = useState([])

  useEffect(() => {
    const wgby = _(watched)
      .groupBy(w => parseInt(w.release_date))
      .map((items, year) => ({ year: year, data: items }))
      .value()
    setWatchedGroupByYear(wgby.sort((a, b) => b.year - a.year))
    console.log(wgby)
  }, [watched]);

  return (
    <Transitions>
      <div className="movie-page">
        <div className="container">
          <div className="header">
            <h1 className="heading">Watched Movies</h1>
            <span className="count-pill">
              {watched.length} {watched.length === 1 ? "Movie" : "Movies"}
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
            watched.length > 0 ? (
              watchedGroupByYear.map((wgby) => (
                <>
                  <h3 className="sticky-thc">{wgby.year}</h3>
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
                </>
              ))
            ) : (
              <h2 className="no-movies">No movies!! Get some!</h2>
            )
            : watched.length > 0 ? (
              <motion.div layout className="movie-grid">
                <AnimatePresence>
                  {watched.map((movie, index) => (
                    <MovieCard
                      movie={movie}
                      key={movie.id}
                      type="watched"
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <h2 className="no-movies">No movies!! Get some!</h2>
            )}

          {/* {} */}

          { }
        </div>
      </div>
    </Transitions>
  );
};
