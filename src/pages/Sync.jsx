import React, { useEffect, useState } from 'react'
import nonton from '../apis/nonton'
import Transitions from '../components/Transition'
import { AnimatePresence, motion } from 'framer-motion'
import MovieCard from '../components/MovieCard'

const Sync = () => {
  const [wfapi, setWfapi] = useState([])
  const [wedfapi, setWedfapi] = useState([])

  const getWatchlistFromAPI = async () => {
    try {
      const fetchData = await nonton.get("watchlist")
      setWfapi(fetchData.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getWatchedFromAPI = async () => {
    try {
      const fetchData = await nonton.get("watched")
      setWedfapi(fetchData.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getWatchlistFromAPI()
    getWatchedFromAPI()
  }, [wfapi])

  const handleSync = () => {
    console.log('syncing now...')
    getWatchlistFromAPI()
    console.log(wfapi)
  }

  return (
    <Transitions>
      <div className="movie-page">
        <div className="container">
          <div className="header" style={{
            display: "flex",
          }}>
            <h2 className="heading">
              Sync Watchlist
            </h2>
            <button className='btn' onClick={handleSync}>sync</button>
          </div>
          {wfapi.length > 0 ?
            <motion.div layout className="movie-grid">
              <AnimatePresence>
                {wfapi.map((movie, index) => (
                  <MovieCard
                    movie={movie}
                    key={`wl-${index}`}
                    type="watchlist"
                    index={index}
                    sync={handleSync}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            : <></>}<br />

          <div className="header" style={{
            display: "flex",
          }}>
            <h2 className="heading">
              Sync Watched
            </h2>
            <button className='btn' onClick={handleSync}>sync</button>
          </div>
          {wfapi.length > 0 ?
            <motion.div layout className="movie-grid">
              <AnimatePresence>
                {wedfapi.map((movie, index) => (
                  <MovieCard
                    movie={movie}
                    key={`wd-${index}`}
                    type="watched"
                    index={index}
                    sync={handleSync}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            : <></>}<br />
        </div>
      </div>
    </Transitions>
  )
}

export default Sync