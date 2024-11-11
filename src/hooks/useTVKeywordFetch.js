import axios from 'axios'
import { useEffect, useState } from 'react'
import tmdb from '../apis/tmdb'

const useTVKeywordFetch = (keyword, pageNumber) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [tv, setTv] = useState([]);
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel
        tmdb.get(`discover/tv`, {
            params: {
                page: pageNumber,
                sort_by: 'popularity.desc',
                // include_adult: 'true',
                with_keywords: keyword
            },
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
            .then(res => {
                setTv(prev => {
                    let newState = [...prev, ...res.data.results]
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
    }, [keyword, pageNumber])

    useEffect(() => {
        setTv([])
    }, [keyword])

    return { loading, error, hasMore, tv }
}

export default useTVKeywordFetch