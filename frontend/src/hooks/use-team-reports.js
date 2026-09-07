import { useCallback, useEffect, useState } from 'react'

import { listAllReports } from '@/api/reports'

export function useTeamReports(filters) {
  const filterKey = JSON.stringify(filters)

  const [reports, setReports] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      const result = await listAllReports(JSON.parse(filterKey))
      setReports(result.reports)
      setPagination(result.pagination)
      setError('')
    } catch (failure) {
      setReports([])
      setError(failure.message)
    } finally {
      setIsLoading(false)
    }
  }, [filterKey])

  useEffect(() => {
    reload()
  }, [reload])

  return { reports, pagination, isLoading, error, reload }
}
