import { Link, createFileRoute } from '@tanstack/react-router'
import { Film, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="mark"><Film size={28} /></div>
        <p className="eyebrow">CLIPORA STUDIO</p>
        <h1>Edit. Caption. Create.</h1>
        <p className="sub">A browser-based video editor with local media storage, timeline editing and animated caption tools.</p>
        <div className="actions">
          <Link className="primary" to="/editor"><Film size={16}/> Open Editor</Link>
          <Link className="secondary" to="/caption-generator"><Sparkles size={16}/> Caption Studio</Link>
        </div>
        <div className="features">
          <span>Local-first</span><span>Timeline editing</span><span>Animated captions</span>
        </div>
      </section>
      <style>{styles}</style>
    </main>
  )
}

const styles = `.home{min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 20%,#191b24 0,#08090d 52%);color:#f7f8fb;font-family:Inter,system-ui,sans-serif}.hero{width:min(760px,100%);padding:64px 28px;text-align:center;border:1px solid #292e39;border-radius:28px;background:rgba(16,18,24,.82);box-shadow:0 30px 90px rgba(0,0,0,.35)}.mark{width:64px;height:64px;margin:0 auto 20px;display:grid;place-items:center;border-radius:19px;background:#f5c542;color:#111}.eyebrow{font-size:10px;letter-spacing:.18em;font-weight:900;color:#a0a6b5}.hero h1{font-size:clamp(38px,7vw,64px);letter-spacing:-.055em;line-height:.98;margin:12px 0}.sub{max-width:590px;margin:0 auto;color:#979eae;line-height:1.7}.actions{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:26px}.primary,.secondary{display:inline-flex;align-items:center;gap:7px;padding:11px 15px;border-radius:10px;text-decoration:none;font-weight:850}.primary{background:#f5c542;color:#111}.secondary{border:1px solid #363b48;background:#171a22;color:#fff}.features{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:28px}.features span{padding:7px 10px;border:1px solid #292e39;border-radius:999px;color:#747d8e;font-size:10px}@media(max-width:600px){.hero{padding:46px 20px}.hero h1{font-size:40px}}`
