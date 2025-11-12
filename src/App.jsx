import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Uploader from './components/Uploader'
import AnalysisView from './components/AnalysisView'
import ChatPanel from './components/ChatPanel'

const API = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth')||'null') } catch { return null }
  })
  const [currentFile, setCurrentFile] = useState(null)

  useEffect(()=>{ if(auth) localStorage.setItem('auth', JSON.stringify(auth)) },[auth])

  const onUploaded = (res) => {
    setCurrentFile(res.file_id)
  }

  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <div className="mx-auto max-w-6xl px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!auth ? (
              <Auth onAuth={setAuth} />
            ) : (
              <>
                <Uploader auth={auth} onUploaded={onUploaded} />
                <Dashboard auth={auth} />
                {currentFile && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2"><AnalysisView auth={auth} fileId={currentFile} /></div>
                    <div className="lg:col-span-1"><ChatPanel auth={auth} fileId={currentFile} /></div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-white text-sm">
              <div className="font-semibold">Security & Compliance</div>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
                <li>Files encrypted at rest</li>
                <li>Auto-delete after 30 days</li>
                <li>GDPR export/delete tools</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-white text-xs">
              Not financial advice. For educational purposes.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
