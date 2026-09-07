import { useCallback, useEffect, useMemo, useState } from 'react'

import { listUsers } from '@/api/users'

export function useUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      const result = await listUsers({ page: 1, limit: 100 })
      setUsers(result.users)
      setError('')
    } catch (failure) {
      setUsers([])
      setError(failure.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const members = useMemo(
    () => users.filter((user) => user.role === 'member' && user.isActive),
    [users]
  )

  return { users, members, isLoading, error, reload }
}
