import { useEffect, useState } from 'react'
import axios from 'axios'

const usePopularFetch = (pageNumber) => {
    const API_KEY = process.env.REACT_APP_TMDB_KEY;
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [movies, setMovies] = useState([]);
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel
        axios({
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/popular',
            params: { page: pageNumber, api_key: API_KEY, },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            console.log(res.config.params)
            setMovies(prevMovies => {
                return [...prevMovies, ...res.data.results]
            })
            setHasMore(res.data.results.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber])

    return { loading, error, hasMore, movies }
}

export default usePopularFetch