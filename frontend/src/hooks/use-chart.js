import { useCallback, useEffect, useState } from 'react'

import { getChart } from '@/api/dashboard'

export function useChart(type) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      setData(await getChart(type, {}))
      setError('')
    } catch (failure) {
      setData(null)
      setError(failure.message)
    } finally {
      setIsLoading(false)
    }
  }, [type])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, isLoading, error }
}
