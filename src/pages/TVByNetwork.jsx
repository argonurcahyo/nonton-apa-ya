import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdb, { BASE_IMG_URL } from '../apis/tmdb'
import LoadingCard from '../components/LoadingCard'
import Transitions from '../components/Transition'
import TVCard from '../components/TVCard'
import useTVNetworkFetch from '../hooks/useTVNetworkFetch'

const TVByNetwork = () => {
  let { id } = useParams()
  const [network, setNetwork] = useState({})
  const [pageNumber, setPageNumber] = useState(1);

  const {
    hasMore, loading, error, tv
  } = useTVNetworkFetch(id, pageNumber)

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

  const fetchNetworkDetail = async (id) => {
    try {
      const fetchedData = await tmdb.get(`network/${id}`);
      console.log(fetchedData.data)
      setNetwork(fetchedData.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchNetworkDetail(id)
    setPageNumber(0)
    setPageNumber(1)
  }, [id]);

  return (
    <Transitions>
      <div className="movie-page">
        <div className="container">
          <div className='network-logo'
            style={{
              padding: "0px 150px",
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px"
            }}>
            <img
              style={{ width: "100%", height: "auto" }}
              src={`${BASE_IMG_URL}${network.logo_path}`}
              alt={network.name} />
          </div>
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

export default TVByNetwork