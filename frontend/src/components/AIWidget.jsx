import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { apiUrl } from '../api'

export default function AIWidget() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const [structuredEnabled, setStructuredEnabled] = useState(false)
  const containerRef = useRef(null)
  const messagesRef = useRef(null)

  const pagePathMap = {
    '/': 'Home',
    '/story': 'Story',
    '/experience': 'Experience',
    '/education': 'Education',
    '/skills': 'Skills',
    '/resume': 'Resume',
    '/passion': 'Passion',
    '/articles': 'Articles',
    '/insights': 'Insights',
    '/ideas': 'Ideas',
    '/work': 'Work',
    '/research': 'Research & Publications',
    '/certificates': 'Certificates',
    '/contact': 'Contact'
  }

  const currentPage = pagePathMap[location.pathname] || location.pathname

  useEffect(() => {
    if (!open) return
    const el = containerRef.current
    if (el) el.querySelector('input')?.focus()
  }, [open])

  // Auto-scroll messages container to bottom when messages change or widget opens
  useEffect(() => {
    const el = messagesRef.current || containerRef.current?.querySelector('.ai-messages')
    if (!el) return
    // Only auto-scroll if the user hasn't scrolled up
    if (!autoScrollEnabled) return
    // Try smooth scroll first; fall back to immediate set
    const scrollToBottom = (smooth = true) => {
      try {
        if (smooth) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
        else el.scrollTop = el.scrollHeight
      } catch (e) { el.scrollTop = el.scrollHeight }
    }
    // immediate sync scroll then a gentle smooth correction
    scrollToBottom(false)
    const t = setTimeout(() => scrollToBottom(true), 60)
    return () => clearTimeout(t)
  }, [sessions, currentSessionId, open])

  // Track user scroll position to enable/disable auto-scroll
  const handleMessagesScroll = () => {
    const el = messagesRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    setAutoScrollEnabled(atBottom)
  }

  // Local storage key for chats
  const STORAGE_KEY = 'ai_chat_sessions_v1'

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : null
      if (parsed && Array.isArray(parsed) && parsed.length) {
        setSessions(parsed)
        setCurrentSessionId(parsed[parsed.length - 1].id)
      } else {
        // create initial session
        const s = { id: Date.now().toString(), created_at: new Date().toISOString(), messages: [] }
        setSessions([s])
        setCurrentSessionId(s.id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify([s]))
      }
    } catch (_err) {
      // Silently ignore storage read failures in environments where localStorage is unavailable.
    }
  }, [])

  const saveSessions = (next) => {
    setSessions(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch (_e) {
      // Ignore write failures when storage cannot be written.
    }
  }

  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0] || { id: null, messages: [] }

  const appendMessage = (msg) => {
    const next = sessions.map((s) => s.id === currentSessionId ? { ...s, messages: [...s.messages, msg] } : s)
    saveSessions(next)
  }

  const sendMessage = async (text, options = {}) => {
    const messageText = (text || '').trim()
    if (!messageText) return
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 8)
    const userMsg = { id, role: 'user', text: messageText, edited: false, ts: new Date().toISOString() }
    appendMessage(userMsg)
    setInput('')
    setSending(true)

    try {
      const res = await fetch(apiUrl('/api/assistant'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, page: currentPage, url: location.pathname, structured: structuredEnabled })
      })

      if (!res.ok) throw new Error('Assistant error')

      const data = await res.json()
      if (data && (data.strengths || data.recommendations || data.pages)) {
        appendMessage({ role: 'assistant', structured: true, payload: data, ts: new Date().toISOString() })
      } else {
        const reply = data?.reply || 'No response received.'
        appendMessage({ role: 'assistant', text: reply, ts: new Date().toISOString() })
      }
    } catch (_err) {
      appendMessage({ role: 'assistant', text: 'Assistant is unavailable.' })
    } finally {
      setSending(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const newChat = () => {
    const s = { id: Date.now().toString(), created_at: new Date().toISOString(), title: 'New chat', messages: [] }
    const next = [...sessions, s]
    saveSessions(next)
    setCurrentSessionId(s.id)
    setInput('')
    setOpen(true)
    // focus input after opening
    setTimeout(() => {
      const el = containerRef.current
      el?.querySelector('input')?.focus()
    }, 50)
  }

  const deleteMessage = (msgId) => {
    const s = currentSession
    if (!s) return
    const msgs = [...s.messages]
    const idx = msgs.findIndex((m) => m.id === msgId)
    if (idx === -1) return
    // if deleting a user message and a following assistant message exists, remove both
    if (msgs[idx].role === 'user' && msgs[idx + 1] && msgs[idx + 1].role === 'assistant') {
      msgs.splice(idx, 2)
    } else {
      msgs.splice(idx, 1)
    }
    const next = sessions.map((ss) => ss.id === s.id ? { ...ss, messages: msgs } : ss)
    saveSessions(next)
  }

  const startEdit = (msg) => {
    if (msg.role !== 'user') return
    setEditingId(msg.id)
    setEditingText(msg.text)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const saveEdit = async () => {
    if (!editingId) return
    const s = currentSession
    const msgs = [...s.messages]
    const idx = msgs.findIndex((m) => m.id === editingId)
    if (idx === -1) return cancelEdit()
    msgs[idx] = { ...msgs[idx], text: editingText, edited: true }
    const next = sessions.map((ss) => ss.id === s.id ? { ...ss, messages: msgs } : ss)
    saveSessions(next)
    // re-send edited message to assistant and replace following assistant reply
    await sendMessage(editingText)
    setEditingId(null)
    setEditingText('')
  }

  const switchSession = (id) => {
    setCurrentSessionId(id)
  }

  const deleteSession = (id) => {
    const next = sessions.filter((s) => s.id !== id)
    saveSessions(next)
    if (currentSessionId === id && next.length) setCurrentSessionId(next[next.length - 1].id)
    if (next.length === 0) newChat()
  }

  const renameSession = (id) => {
    const label = prompt('Session name:')
    if (!label) return
    const next = sessions.map((s) => (s.id === id ? { ...s, title: label } : s))
    saveSessions(next)
  }

  return (
    <>
      <div
        className={`ai-widget ${open ? 'open' : ''}`}
        ref={containerRef}
        aria-hidden={!open}
        style={{ display: open ? 'flex' : 'none', width: '32rem' }}
      >
        <div style={{ height: '100%', width: '100%' }}>
          <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
            <div className="ai-header d-flex align-items-center justify-content-between px-3 py-2">
              <div>
                <strong>AI Assistant</strong>
                <span className="ms-2 text-muted" style={{ fontSize: '0.85rem' }}>({currentPage})</span>
                <button className="btn btn-sm btn-outline-light ms-3" style={{ fontSize: '0.75rem' }} onClick={newChat}>New chat</button>
                <button className="btn btn-sm btn-outline-secondary ms-2" style={{ fontSize: '0.75rem' }} onClick={() => { localStorage.removeItem(STORAGE_KEY); setSessions([]); setCurrentSessionId(null); newChat(); }}>Clear</button>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { setOpen(false) }} aria-label="Close assistant">Close</button>
              </div>
            </div>

            <div ref={messagesRef} className="ai-messages p-3" style={{ flex: '1 1 auto', overflow: 'auto' }} onScroll={handleMessagesScroll}>
              {(!currentSession || (currentSession.messages || []).length === 0) && (
                <div className="muted-text">
                  <p style={{ marginBottom: '0.5rem' }}>Ask about {currentPage === 'Home' ? 'the portfolio' : `this ${currentPage} page`}, or ask general questions about the website.</p>
                  <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>Try: "What's on this page?", "Tell me about this section", or "How can I contact you?"</p>
                </div>
              )}
              {(currentSession.messages || []).map((m, i) => (
                <div key={m.id || i} className={`ai-msg ${m.role}`} style={{ position: 'relative' }}>
                  {m.structured ? (
                    <div className="ai-structured-card">
                      {m.payload.site && <div className="ai-structured-title"><strong>{m.payload.site} Analysis</strong></div>}
                      {m.payload.strengths && m.payload.strengths.length > 0 && (
                        <div className="ai-structured-section">
                          <strong>Strengths</strong>
                          <ul>
                            {m.payload.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {m.payload.gaps && m.payload.gaps.length > 0 && (
                        <div className="ai-structured-section">
                          <strong>Opportunities / Gaps</strong>
                          <ul>
                            {m.payload.gaps.map((g, idx) => <li key={idx}>{g}</li>)}
                          </ul>
                        </div>
                      )}
                      {m.payload.recommendations && m.payload.recommendations.length > 0 && (
                        <div className="ai-structured-section">
                          <strong>Recommendations</strong>
                          <ul>
                            {m.payload.recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
                          </ul>
                        </div>
                      )}
                      {m.payload.pages && m.payload.pages.length > 0 && (
                        <div className="ai-structured-section">
                          <strong>Pages (short)</strong>
                          <ul>
                            {m.payload.pages.map((p, idx) => <li key={idx}>{p}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="ai-msg-text">{m.text}{m.edited ? ' (edited)' : ''}</div>
                  )}
                  {/* per-message edit controls removed per user request */}
                </div>
              ))}
            </div>

            {!autoScrollEnabled && (
              <button
                type="button"
                className="ai-scroll-btn"
                onClick={() => {
                  const el = messagesRef.current
                  if (!el) return
                  try { el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }) } catch (e) { el.scrollTop = el.scrollHeight }
                  setAutoScrollEnabled(true)
                }}
              >
                Scroll to latest
              </button>
            )}

            <div className="ai-input p-3 border-top">
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Ask about this page..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button className="btn btn-primary" onClick={() => sendMessage(input)} disabled={sending}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="ai-launch btn btn-primary"
        aria-label="Open assistant"
        onClick={() => setOpen((o) => !o)}
      >
        AI
      </button>
    </>
  )
}
