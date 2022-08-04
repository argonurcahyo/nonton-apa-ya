import React, { useContext, useEffect, useState } from 'react'
import nonton from '../apis/nonton'
import Transitions from '../components/Transition'
import { AnimatePresence, motion } from 'framer-motion'
import MovieCard from '../components/MovieCard'
import { GlobalContext } from '../context/GlobalState'

const Sync = () => {
  const [wfapi, setWfapi] = useState([])
  const { watchlist, dbFunction } = useContext(GlobalContext)

  const getWatchlistFromAPI = async () => {
    try {
      const fetchData = await nonton.get("watchlist")
      setWfapi(fetchData.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  const syncLocalToDb = () => {
    watchlist.forEach(w => {
      const d = dbFunction.postMovieToWatchlist(w)
      console.log(d)
    })
  }


  useEffect(() => {
    getWatchlistFromAPI()
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
                    key={movie.id}
                    type="watchlist"
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