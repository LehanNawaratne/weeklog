import { useCallback, useEffect, useState } from 'react'

import { listMyReports } from '@/api/reports'

export function useMyReports({ limit = 50 } = {}) {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      const result = await listMyReports({ page: 1, limit })
      setReports(result.reports)
      setError('')
    } catch (failure) {
      setReports([])
      setError(failure.message)
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  useEffect(() => {
    reload()
  }, [reload])

  return { reports, isLoading, error, reload }
}
