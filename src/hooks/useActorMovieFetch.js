import { useEffect, useState } from 'react'
import axios from 'axios'

const useActorMovieFetch = (id, pageNumber) => {
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
            url: 'https://api.themoviedb.org/3/discover/movie',
            params: {
                page: pageNumber,
                api_key: API_KEY,
                with_cast: id,
                sort_by: "primary_release_date.desc",
                without_genres: "99, 10770"
            },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setMovies(prevMovies => {
                let newState = [...prevMovies, ...res.data.results]
                let uniqueList = [...new Map(newState?.map((item) => [item["id"], item]))]
                return uniqueList.map(i => i[1])
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

    useEffect(() => {
        setLoading(false)
        setMovies([])
        setError(false)
        setHasMore(false)
    }, [id])

    return { loading, error, hasMore, movies }
}

export default useActorMovieFetch