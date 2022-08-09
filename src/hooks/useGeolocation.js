import { useEffect, useState } from "react";

export default function useGeolocation(options) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [data, setData] = useState({})

    useEffect(() => {
        const succesHandler = e => {
            setLoading(false)
            setError(null)
            setData(e.coords)
        }
        const errorHandler = e => {
            setError(e)
            setLoading(false)
        }
        navigator.geolocation.getCurrentPosition(
            succesHandler,
            errorHandler,
            options
        )
        const id = navigator.geolocation.watchPosition(
            succesHandler,
            errorHandler,
            options
        )
        return () => navigator.geolocation.clearWatch(id)

    }, [options])

    return { loading, error, data }
}