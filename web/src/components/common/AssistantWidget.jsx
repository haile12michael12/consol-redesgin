import { ArrowUp, Bot, MessageSquare, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { askAssistant } from '@/services/assistantApi'
import { cn } from '@/lib/utils'

let messageId = 0
const nextId = () => `msg-${++messageId}`

/**
 * Floating assistant interface.
 *
 * The UI is complete; answers come from the prepared knowledge base in
 * `src/services/assistantApi.js` until the Laravel assistant endpoint is
 * approved. No browser-side provider key is used anywhere.
 */
export function AssistantWidget() {
  const t = useT()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([])
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // Keep the assistant off the admin area.
  const hidden = location.pathname.startsWith('/admin')

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: nextId(), role: 'assistant', text: t('assistant.greeting') }])
    }
  }, [t, messages.length])

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, busy])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const send = async (text) => {
    const question = (text ?? input).trim()
    if (!question || busy) return
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: question }])
    setInput('')
    setBusy(true)
    try {
      const answer = await askAssistant(question)
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', text: t('assistant.error'), error: true },
      ])
    } finally {
      setBusy(false)
    }
  }

  if (hidden) return null

  const suggestions = [t('assistant.s1'), t('assistant.s2'), t('assistant.s3'), t('assistant.s4')]

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="consol-assistant"
        aria-label={open ? t('assistant.close') : t('assistant.open')}
        className={cn(
          'fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2.5 border px-4 text-[0.75rem] font-bold uppercase tracking-[0.1em] shadow-[0_18px_40px_-16px_rgba(16,29,50,0.6)] transition-all duration-300 sm:bottom-7 sm:right-7',
          open
            ? 'border-navy bg-navy text-white'
            : 'border-gold bg-gold text-navy hover:bg-gold-soft',
        )}
      >
        {open ? (
          <X className="size-4" aria-hidden="true" />
        ) : (
          <MessageSquare className="size-4" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{open ? t('common.close') : 'CONSOL AI'}</span>
      </button>

      <div
        id="consol-assistant"
        role="dialog"
        aria-modal="false"
        aria-label={t('assistant.title')}
        aria-hidden={!open}
        inert={!open}
        className={cn(
          'fixed bottom-20 right-4 z-40 flex max-h-[min(34rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col border border-line bg-white shadow-[0_40px_90px_-30px_rgba(16,29,50,0.55)] transition-all duration-300 sm:bottom-24 sm:right-7 sm:w-[25rem]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line bg-navy px-5 py-4 text-white">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center border border-gold/40 bg-gold/10">
              <Bot className="size-4 text-gold" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-[0.875rem] font-semibold text-white">{t('assistant.title')}</h2>
              <p className="mt-0.5 text-[0.6875rem] text-white/55">{t('assistant.subtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('assistant.close')}
            className="grid size-8 shrink-0 place-items-center text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] px-3.5 py-2.5 text-[0.8125rem] leading-relaxed',
                  message.role === 'user'
                    ? 'bg-navy text-white'
                    : message.error
                      ? 'border border-danger/30 bg-danger/5 text-danger'
                      : 'bg-canvas text-ink',
                )}
              >
                {message.text}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex items-center gap-2 text-[0.75rem] text-muted" role="status">
              <span className="flex gap-1" aria-hidden="true">
                <span className="size-1.5 animate-pulse rounded-full bg-gold" />
                <span
                  className="size-1.5 animate-pulse rounded-full bg-gold"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="size-1.5 animate-pulse rounded-full bg-gold"
                  style={{ animationDelay: '300ms' }}
                />
              </span>
              {t('assistant.thinking')}
            </div>
          )}

          {messages.length <= 1 && !busy && (
            <div className="border-t border-line pt-3">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">
                {t('assistant.suggestions')}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="border border-line px-2.5 py-1.5 text-left text-[0.6875rem] font-medium text-navy transition-colors hover:border-gold hover:bg-gold/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
          className="border-t border-line p-3"
        >
          <div className="flex items-end gap-2">
            <label htmlFor="assistant-input" className="sr-only">
              {t('assistant.placeholder')}
            </label>
            <textarea
              id="assistant-input"
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  send()
                }
              }}
              placeholder={t('assistant.placeholder')}
              className="max-h-24 min-h-11 flex-1 resize-none border border-line px-3 py-2.5 text-[0.8125rem] text-ink outline-none placeholder:text-muted/80 focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
            <Button
              type="submit"
              size="icon"
              variant="primary"
              disabled={!input.trim() || busy}
              aria-label={t('assistant.send')}
              className="size-11"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-[0.5625rem] leading-relaxed text-muted">{t('assistant.disclaimer')}</p>
        </form>
      </div>
    </>
  )
}
