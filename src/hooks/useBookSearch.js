import axios from "axios";
import { useEffect, useState } from 'react'

const useBookSearch = (query, pageNumber) => {
    const API_KEY = process.env.REACT_APP_TMDB_KEY;
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState([])
    const [movies, setMovies] = useState([]);
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel
        axios({
            method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie',
            params: { query: query, page: pageNumber, api_key: API_KEY, },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            if (query.length >= 5) console.log(res.config.params)
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...res.data.results.map(b => b.title)])]
            })
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
    }, [query, pageNumber])

    return { loading, error, books, hasMore, movies }
}

export default useBookSearch