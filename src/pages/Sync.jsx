import React, { useEffect, useState } from 'react'
import nonton from '../apis/nonton'
import Transitions from '../components/Transition'
import { AnimatePresence, motion } from 'framer-motion'
import MovieCard from '../components/MovieCard'

const Sync = () => {
 const [wfapi, setWfapi] = useState([])

 const getWatchlistFromAPI = async () => {
  try {
   const fetchData = await nonton.get("watchlist")
   // console.log(fetchData.data.data)
   setWfapi(fetchData.data.data)
  } catch (error) {
   console.log(error)
  }
 }
 useEffect(() => {
  getWatchlistFromAPI()
  console.log(wfapi)
 }, [])

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     <div className="header">
      <h2 className="heading">
       Sync Watchlist
      </h2>
     </div>
     {wfapi.length > 0 ?
      <motion.div layout className="movie-grid">
       <AnimatePresence>
        {wfapi.map((movie, index) => (
         <MovieCard
          movie={movie}
          key={movie.id}
          type="watchlist"
          index={index} />
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