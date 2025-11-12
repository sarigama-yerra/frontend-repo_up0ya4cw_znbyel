import { useEffect, useRef, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

export default function ChatPanel({ auth, fileId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  const headers = { Authorization: `Bearer ${auth?.token}`, 'Content-Type': 'application/json' }

  const load = async () => {
    const res = await fetch(`${API}/files/${fileId}/chat`, { headers: { Authorization: `Bearer ${auth?.token}` } })
    const data = await res.json()
    if (res.ok) setMessages(data)
  }
  useEffect(() => { if (fileId) load() }, [fileId])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input) return
    setLoading(true)
    const res = await fetch(`${API}/files/${fileId}/chat`, { method: 'POST', headers, body: JSON.stringify({ message: input }) })
    const data = await res.json()
    if (res.ok) {
      setMessages(m => [...m, { role: 'user', content: input, _local: true }, { role: 'assistant', content: data.reply, _local: true }])
      setInput('')
    }
    setLoading(false)
  }

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-black/30">
      <div className="px-4 py-3 border-b border-white/10 text-white font-semibold">Chat</div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 ${m.role === 'user' ? 'ml-auto bg-indigo-500/80 text-white' : 'bg-white/10 text-white'}`}>{m.content}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-white/10 flex gap-2">
        <input className="flex-1 rounded-md bg-black/40 border border-white/10 px-3 py-2 text-white outline-none" placeholder="Ask about this PDF..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send() }} />
        <button className="rounded-md bg-white/10 px-4 py-2 text-white hover:bg-white/20" onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  )
}
