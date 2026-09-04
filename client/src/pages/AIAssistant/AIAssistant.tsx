import { useState, useRef, useEffect } from 'react'
import './AIAssistant.css'

interface HistoryEntry {
  prompt: string
  response: string
}

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('')
  const [activePrompt, setActivePrompt] = useState('')
  const [streamingResponse, setStreamingResponse] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const responseRef = useRef('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [streamingResponse, history])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || streaming) return

    const currentPrompt = prompt.trim()
    setPrompt('')
    setActivePrompt(currentPrompt)
    setStreamingResponse('')
    setError('')
    setStreaming(true)
    responseRef.current = ''

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const res = await fetch(`${backendUrl}/api/ai/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Request failed')
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const parsed = JSON.parse(line.slice(6))
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) {
              responseRef.current += text
              setStreamingResponse(responseRef.current)
            }
          } catch {
            // non-JSON SSE line, skip
          }
        }
      }

      setHistory((prev) =>
        [...prev, { prompt: currentPrompt, response: responseRef.current }].slice(-3)
      )
      setStreamingResponse('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="ai-page">
      <div className="ai-header">
        <h1>🥄 AI Recipe Assistant</h1>
        <p>Ask anything about recipes, ingredients, or cooking techniques.</p>
      </div>

      <div className="ai-conversation">
        {history.map((entry, i) => (
          <div key={i} className="ai-entry">
            <div className="ai-bubble user">{entry.prompt}</div>
            <div className="ai-bubble assistant">{entry.response}</div>
          </div>
        ))}

        {streaming && (
          <div className="ai-entry">
            <div className="ai-bubble user">{activePrompt}</div>
            <div className="ai-bubble assistant">
              {streamingResponse || <span className="ai-thinking">Thinking…</span>}
            </div>
          </div>
        )}

        {error && <p className="ai-error">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="ai-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about a recipe, substitutions, cooking tips..."
          rows={3}
          disabled={streaming}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e as unknown as React.FormEvent)
            }
          }}
        />
        <button type="submit" disabled={streaming || !prompt.trim()}>
          {streaming ? 'Generating…' : 'Ask'}
        </button>
      </form>
    </div>
  )
}
