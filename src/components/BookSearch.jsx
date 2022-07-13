import React from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import useBookSearch from '../hooks/useBookSearch'
import { MovieCard } from './MovieCard'
import Transitions from './Transition'

const BookSearch = () => {
 const [query, setQuery] = useState('')
 const [pageNumber, setPageNumber] = useState(1)

 const {
  hasMore, loading, error, movies
 } = useBookSearch(query, pageNumber)

 const observer = useRef()
 const lastBookElementRef = useCallback(node => {
  if (loading) return
  if (observer.current) observer.current.disconnect()
  observer.current = new IntersectionObserver(entries => {
   if (entries[0].isIntersecting && hasMore) {
    setPageNumber(prevPageNumber => prevPageNumber + 1)
   }
  })
  if (node) observer.current.observe(node)
 }, [loading, hasMore])

 const handleSearch = e => {
  setQuery(e.target.value)
  setPageNumber(1)
 }

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container add-content" style={{ margin: "0 80px" }}>
     <div className="input-wrapper">
      <input
       type="text"
       value={query}
       onChange={handleSearch}
      />
     </div>
     {/* {books.map((book, index) => {
      if (books.length === index + 1) {
       return <div ref={lastBookElementRef} key={book}>{book}</div>
      } else {
       return <div key={book}>{book}</div>
      }
     })} */}
     {movies.length > 0 && (
      <div className="movie-grid">
       {movies.map((movie, index) => {
        if (movies.length === index + 1) {
         return <MovieCard
          ref={lastBookElementRef}
          movie={movie}
          index={index}
          key={index}
          type="search"
         />
        } else {
         return <MovieCard
          movie={movie}
          index={index}
          key={index}
          type="search"
         />
        }
       })}
      </div>
     )}
     <div>{loading && 'Loading...'}</div>
     <div>{error && 'Error'}</div>
    </div>
   </div>
  </Transitions>
 )
}

export default BookSearch