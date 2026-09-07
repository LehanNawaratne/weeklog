import { useCallback, useState } from 'react'

import { sendChat } from '@/api/assistant'

const MAX_HISTORY = 20

export function useAssistant() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const ask = useCallback(
    async (question) => {
      const text = question.trim()

      if (!text || isLoading) {
        return
      }

      const history = [...messages, { role: 'user', content: text }]

      setMessages(history)
      setIsLoading(true)
      setError('')

      try {
        const reply = await sendChat(history.slice(-MAX_HISTORY))
        setMessages([...history, { role: 'assistant', content: reply }])
      } catch (failure) {
        setError(failure.message)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, messages]
  )

  const reset = useCallback(() => {
    setMessages([])
    setError('')
  }, [])

  return { messages, isLoading, error, ask, reset }
}
