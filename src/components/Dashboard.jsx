import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

function FileRow({ f, onAnalyze, onOpen }) {
  return (
    <div className="grid grid-cols-5 items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white">
      <div className="truncate" title={f.filename}>{f.filename}</div>
      <div className="text-white/70">{new Date(f.uploaded_at).toLocaleString()}</div>
      <div className="text-white/70">{f.status}</div>
      <div className="text-white/70">{f.last_queried_at ? new Date(f.last_queried_at).toLocaleString() : '-'}</div>
      <div className="flex gap-2 justify-end">
        <button onClick={() => onOpen(f)} className="rounded-md bg-white/10 px-3 py-1 text-sm hover:bg-white/20">Open</button>
        <button onClick={() => onAnalyze(f)} className="rounded-md bg-indigo-500/80 px-3 py-1 text-sm hover:bg-indigo-500">Analyze</button>
      </div>
    </div>
  )
}

export default function Dashboard({ auth }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const headers = { Authorization: `Bearer ${auth?.token}` }

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/files`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to load files')
      setFiles(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { if (auth?.token) load() }, [auth?.token])

  const analyze = async (f) => {
    await fetch(`${API}/files/${f._id}/analyze`, { method:'POST', headers })
    load()
  }

  const open = (f) => {
    window.location.href = `/file/${f._id}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">Your Files</h2>
        <button className="rounded-md bg-white/10 px-3 py-2 hover:bg-white/20" onClick={load}>Refresh</button>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="grid gap-2">
        <div className="grid grid-cols-5 gap-3 text-white/60 text-sm px-2">
          <div>Filename</div>
          <div>Uploaded</div>
          <div>Status</div>
          <div>Last Queried</div>
          <div className="text-right">Actions</div>
        </div>
        {files.map(f => <FileRow key={f._id} f={f} onAnalyze={analyze} onOpen={open} />)}
        {(!files || files.length === 0) && <div className="text-white/60">No files yet.</div>}
      </div>
    </div>
  )
}
