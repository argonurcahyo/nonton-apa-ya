import React, { useState, useEffect, useRef, useCallback } from 'react'
import Transitions from '../components/Transition'
import MovieCard from '../components/MovieCard'
import TVCard from '../components/TVCard'
import LoadingCard from '../components/LoadingCard'

/**
 * Reusable page component for paginated content lists
 * Eliminates boilerplate from MovieByGenre, MovieByKeyword, TVByNetwork, etc.
 * 
 * @param {array} items - Array of movie/tv objects to display
 * @param {boolean} loading - Loading state
 * @param {boolean} hasMore - Whether more items are available
 * @param {function} onLoadMore - Callback when intersection observer triggers
 * @param {string} title - Page title to display
 * @param {string} contentType - 'movie' or 'tv' to determine card component
 * @param {boolean} error - Error state
 * @returns {JSX.Element}
 */
const PaginatedPage = ({ 
  items = [], 
  loading = false, 
  hasMore = false, 
  onLoadMore,
  title,
  contentType = 'movie',
  error = false 
}) => {
  const observer = useRef()
  
  const lastElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore?.()
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore, onLoadMore])

  const CardComponent = contentType === 'tv' ? TVCard : MovieCard

  return (
    <Transitions>
      <div className="movie-page">
        <div className="container">
          {title && <h3>{title}</h3>}
          {items.length > 0 ? (
            <div className="movie-grid">
              {items.map((item, index) => (
                <CardComponent
                  ref={index === items.length - 1 ? lastElementRef : null}
                  movie={item}
                  tv={item}
                  index={index}
                  key={item.id}
                  type="search"
                />
              ))}
              {loading && <LoadingCard />}
            </div>
          ) : (
            <h2 className="no-movies">No items found. Get some!</h2>
          )}
          {error && <div className="error-message">Error loading data</div>}
        </div>
      </div>
    </Transitions>
  )
}

export default PaginatedPage
