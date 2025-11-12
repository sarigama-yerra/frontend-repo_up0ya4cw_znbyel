import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

export default function AnalysisView({ auth, fileId }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch(`${API}/files/${fileId}/analysis`, { headers: { Authorization: `Bearer ${auth?.token}` } })
    const data = await res.json()
    if (res.ok) setAnalysis(data)
    setLoading(false)
  }
  useEffect(() => { if (fileId) load() }, [fileId])

  if (loading) return <div className="text-white/70">Loading analysis...</div>
  if (!analysis) return <div className="text-white/70">No analysis yet. Click Analyze on the dashboard.</div>

  const metrics = [
    { label: 'Health Score', value: `${analysis.health_score}` },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-4 text-white">
            <div className="text-white/60 text-xs">{m.label}</div>
            <div className="text-2xl font-semibold">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-white">
        <div className="text-white/80 font-semibold">Recommendations</div>
        <ul className="list-disc pl-5 text-white/80">
          {(analysis.recommendations || []).map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-white">
        <div className="text-white/80 font-semibold">Risks</div>
        <ul className="list-disc pl-5 text-white/80">
          {(analysis.risks || []).map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
    </div>
  )
}
