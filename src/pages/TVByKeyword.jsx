import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import tmdb from '../apis/tmdb';
import LoadingCard from '../components/LoadingCard';
import Transitions from '../components/Transition';
import TVCard from '../components/TVCard';
import useTVKeywordFetch from '../hooks/useTVKeywordFetch';

const TVByKeyword = () => {
 let { id } = useParams()
 const [keyword, setKeyword] = useState({})
 const [pageNumber, setPageNumber] = useState(1);

 const {
  hasMore, loading, error, tv
 } = useTVKeywordFetch(id, pageNumber)

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

 const fetchKeyword = async (id) => {
  try {
   const fetchedData = await tmdb.get(`keyword/${id}`);
   setKeyword(fetchedData.data);
   console.log(fetchedData.data)
  } catch (error) {
   console.log(error);
   setKeyword([]);
  }
 }

 useEffect(() => {
  fetchKeyword(id)
  setPageNumber(0)
  setPageNumber(1)
 }, [id]);

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     {keyword && <h3>{keyword?.name}</h3>}
     {tv.length > 0 ? (
      <div className="movie-grid">
       {tv.map((t, index) => (
        <TVCard
         ref={lastGridElementRef}
         tv={t}
         key={index}
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

export default TVByKeyword