import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const requestLink = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API}/auth/magic-link`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to request link')
      setToken(data.token)
      setLink(data.login_url)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const useToken = async () => {
    try {
      setLoading(true)
      setError('')
      const url = new URL(`${API}${link}`)
      const t = url.searchParams.get('token') || token
      const res = await fetch(`${API}/auth/callback?token=${t}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      onAuth({ email: data.email, token: data.token })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-neutral-900 text-white p-6 rounded-xl border border-white/10">
      <h3 className="text-xl font-semibold">Sign in</h3>
      <p className="text-sm text-white/70">Passwordless login with a magic link</p>
      <div className="mt-4 flex gap-2">
        <input className="flex-1 rounded-md bg-black/40 border border-white/10 px-3 py-2 outline-none" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="rounded-md bg-white/10 px-4 py-2 hover:bg-white/20" onClick={requestLink} disabled={loading}>Send link</button>
      </div>
      {link && (
        <div className="mt-3 text-sm">
          <div className="text-white/70">Demo link ready:</div>
          <code className="break-all text-xs">{API}{link}</code>
          <div className="mt-2 flex gap-2">
            <input className="flex-1 rounded-md bg-black/40 border border-white/10 px-3 py-2" value={token} readOnly />
            <button className="rounded-md bg-white/10 px-4 py-2 hover:bg-white/20" onClick={useToken} disabled={loading}>Login</button>
          </div>
        </div>
      )}
      {error && <div className="mt-3 text-red-400 text-sm">{error}</div>}
    </div>
  )
}
