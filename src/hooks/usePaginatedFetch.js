import axios from 'axios'
import { useEffect, useState } from 'react'
import tmdb from '../apis/tmdb'

/**
 * Generic hook for paginated TMDB API calls
 * @param {string} endpoint - TMDB endpoint (e.g., 'movie/popular', 'discover/movie')
 * @param {object} params - Query parameters (e.g., { with_genres: 123 })
 * @param {number} pageNumber - Current page number
 * @param {string} dataKey - Key in response for results (default: 'results')
 * @returns {object} { loading, error, hasMore, data }
 */
const usePaginatedFetch = (endpoint, params = {}, pageNumber = 1, dataKey = 'results') => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    if (!endpoint) return

    setLoading(true)
    setError(false)
    let cancel

    const requestParams = {
      page: pageNumber,
      ...params
    }

    tmdb.get(endpoint, {
      params: requestParams,
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then(res => {
        const results = res.data[dataKey] || []
        setData(prevData => {
          let newState = [...prevData, ...results]
          // Deduplicate by id
          let uniqueList = [...new Map(newState.map((item) => [item.id, item]))]
          return uniqueList.map(i => i[1])
        })
        setHasMore(results.length > 0)
        setLoading(false)
      })
      .catch(e => {
        if (axios.isCancel(e)) return
        setError(true)
      })

    return () => cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, endpoint, JSON.stringify(params)])

  // Reset data when params change
  useEffect(() => {
    setData([])
  }, [endpoint, JSON.stringify(params)])

  return { loading, error, hasMore, data }
}

export default usePaginatedFetch
