import { useCallback, useEffect, useState } from 'react'

import { listProjects } from '@/api/projects'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      setProjects(await listProjects())
      setError('')
    } catch (failure) {
      setProjects([])
      setError(failure.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { projects, isLoading, error, reload }
}
