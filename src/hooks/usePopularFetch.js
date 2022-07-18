import axios from 'axios';
import { useEffect, useState } from 'react'
import tmdb from '../apis/tmdb'

const usePopularFetch = (pageNumber) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [movies, setMovies] = useState([]);
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel
        tmdb.get("movie/popular", {
            params: {
                page: pageNumber,
                language: "en-US"
            },
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
            .then(res => {
                console.log(res.config.params)
                setMovies(prevMovies => {
                    let newState = [...prevMovies, ...res.data.results]
                    let uniqueList = [...new Map(newState?.map((item) => [item["id"], item]))]
                    console.log(uniqueList)
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

    return { loading, error, hasMore, movies }
}

export default usePopularFetch