import { useEffect, useState } from 'react'
import { normalizeApiResponse } from '../normalizeApiResponse.js'

export function useFetchApiResource(endpoint, fetcher) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    fetcher(endpoint, controller.signal)
      .then(normalizeApiResponse)
      .then(setData)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load this information.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [endpoint, fetcher])

  return { data, loading, error }
}
