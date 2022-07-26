import React, { useCallback, useRef, useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import tmdb, { BASE_IMG_URL } from '../apis/tmdb'
import Transitions from '../components/Transition'
import useNetworkFetch from '../hooks/useNetworkFetch'
import MovieCard from '../components/MovieCard'
import LoadingCard from '../components/LoadingCard'

const MovieByNetwork = () => {
 let { id } = useParams()
 const [network, setNetwork] = useState({})
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, movies
 } = useNetworkFetch(id, pageNumber)

 const observer = useRef()
 const lastGridElementRef = useCallback(node => {
  if (loading) return
  if (observer.current) observer.current.disconnect()
  observer.current = new IntersectionObserver(entries => {
   if (entries[0].isIntersecting && hasMore) {
    setPageNumber(prevPageNumber => prevPageNumber + 1)
   }
  })
  if (node) observer.current.observe(node)
 }, [loading, hasMore])

 const fetchNetworkList = async () => {
  try {
   const fetchedData = await tmdb.get("watch/providers/movie");
   console.log(fetchedData.data.results.find(n => n.provider_id === parseInt(id)))
   setNetwork(fetchedData.data.results.find(n => n.provider_id === parseInt(id)))
  } catch (error) {
   console.log(error);
  }
 }

 useEffect(() => {
  fetchNetworkList()
  setPageNumber(0)
  setPageNumber(1)
 }, [id])

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     <div className='network-logo'>
      <img src={`${BASE_IMG_URL}${network.logo_path}`} alt="" />
     </div>
     {movies.length > 0 ? (
      <div className="movie-grid">
       {movies.map((movie, index) => (
        <MovieCard
         ref={lastGridElementRef}
         movie={movie}
         index={index}
         key={movie.id}
         type="search"
        />
       ))}
       {loading && <LoadingCard />}
      </div>
     ) : (
      <h2 className="no-movies">No movies!! Get some!</h2>
     )}
     {error && <>Error...</>}
    </div>
   </div>
  </Transitions>
 )
}

export default MovieByNetwork