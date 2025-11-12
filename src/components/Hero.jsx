import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="backdrop-blur-sm/0">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Finanalyzer
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Upload your financial statements and get AI-driven analysis, forecasts, and actionable insights.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#upload" className="inline-flex items-center rounded-lg bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/20 transition">Get Started</a>
            <a href="#how" className="inline-flex items-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition">How it works</a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
    </section>
  )
}
