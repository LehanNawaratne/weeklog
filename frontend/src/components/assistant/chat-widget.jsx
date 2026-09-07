import { Loader2, RotateCcw, Send, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/auth-context'
import { useAssistant } from '@/hooks/use-assistant'

const SUMMARY_PROMPT =
  'Summarise the team last week. Cover completed work, recurring blockers and workload imbalances.'

const SUGGESTIONS = [
  'What did the team work on last week?',
  'Which blockers keep coming back?',
  'Whose reports still need correction?'
]

export function ChatWidget() {
  const { isManager } = useAuth()
  const { messages, isLoading, error, ask, reset } = useAssistant()
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (!isManager) {
    return null
  }

  function send(question) {
    ask(question)
    setDraft('')
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send(draft)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed right-6 bottom-6 z-40 size-12 rounded-full shadow-lg">
          <Sparkles className="size-5" />
          <span className="sr-only">Ask the assistant</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-border border-b">
          <SheetTitle>Assistant</SheetTitle>
          <SheetDescription>
            Ask about your team. Answers come only from reports the team has submitted.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-start gap-2">
              <p className="text-muted-foreground text-xs">Try one of these</p>

              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="border-border hover:bg-muted rounded-lg border px-3 py-1.5 text-left text-sm transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}

          {messages.map((message, index) => (
            <p
              key={`${message.role}-${index}`}
              className={
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground max-w-[85%] self-end rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap'
                  : 'bg-muted max-w-[95%] self-start rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap'
              }
            >
              {message.content}
            </p>
          ))}

          {isLoading ? (
            <p className="text-muted-foreground flex items-center gap-2 self-start text-sm">
              <Loader2 className="size-4 animate-spin" />
              Reading the reports…
            </p>
          ) : null}

          {error ? <p className="text-destructive text-sm">{error}</p> : null}

          <div ref={endRef} />
        </div>

        <div className="border-border flex flex-col gap-2 border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => send(SUMMARY_PROMPT)}
              disabled={isLoading}
            >
              <Sparkles />
              Summarise this week
            </Button>

            {messages.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={reset} disabled={isLoading}>
                <RotateCcw />
                Clear
              </Button>
            ) : null}
          </div>

          <div className="flex items-end gap-2">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the team…"
              rows={2}
              className="max-h-32 min-h-16 resize-none"
            />

            <Button size="icon-lg" onClick={() => send(draft)} disabled={isLoading || !draft.trim()}>
              <Send className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
