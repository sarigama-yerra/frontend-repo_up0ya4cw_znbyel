import { useCallback, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

export default function Uploader({ auth, onUploaded }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const handleFiles = async (files) => {
    const file = files[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) {
      setError('Max 50MB')
      return
    }
    const form = new FormData()
    form.append('uploaded', file)
    const res = await fetch(`${API}/files/upload`, { method: 'POST', headers: { Authorization: `Bearer ${auth?.token}` }, body: form })
    const data = await res.json()
    if (!res.ok) {
      setError(data.detail || 'Upload failed')
    } else {
      onUploaded?.(data)
      setError('')
    }
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  return (
    <div id="upload" className={`rounded-2xl border-2 border-dashed p-8 text-center ${dragOver ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/10 bg-black/30'} text-white`} onDragOver={e=>{e.preventDefault(); setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={onDrop}>
      <div className="text-white/80">Drag & drop PDF here (max 50MB)</div>
      <div className="mt-2 text-xs text-white/60">Your files are encrypted at rest</div>
      <div className="mt-4">
        <input type="file" accept="application/pdf" onChange={e=>handleFiles(e.target.files)} className="hidden" id="file" />
        <label htmlFor="file" className="cursor-pointer rounded-md bg-white/10 px-4 py-2 hover:bg-white/20">Choose File</label>
      </div>
      {error && <div className="mt-3 text-red-400 text-sm">{error}</div>}
    </div>
  )
}
