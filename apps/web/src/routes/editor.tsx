import { Link, createFileRoute } from '@tanstack/react-router'
import { Film, FolderOpen, Plus, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'

export const Route = createFileRoute('/editor')({ component: Editor })
type Project = { version: 1; type: 'clipora-project'; name: string; createdAt: string }

function Editor() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')
  const createProject = () => setProject({ version: 1, type: 'clipora-project', name: 'Untitled Clipora Project', createdAt: new Date().toISOString() })
  const openProject = async (file?: File) => {
    if (!file) return
    try {
      const data = JSON.parse(await file.text()) as Partial<Project>
      if (data.type !== 'clipora-project' || data.version !== 1 || typeof data.name !== 'string') throw new Error('Invalid Clipora project file.')
      setProject({ version: 1, type: 'clipora-project', name: data.name, createdAt: data.createdAt || new Date().toISOString() }); setError('')
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not open project.') }
  }
  return <main className="editor-shell"><header><Link to="/" className="brand"><Sparkles size={18}/> Clipora</Link><span>Local-first workspace</span></header><section className="editor-content">{project ? <><p className="kicker">PROJECT</p><h1>{project.name}</h1><p className="copy">Your Clipora project is initialized. Continue in the caption workspace to import video and create animated captions.</p><Link to="/caption-generator" className="primary">Open Caption Studio</Link></> : <div className="empty"><div className="icon"><Film size={30}/></div><p className="kicker">CLIPORA STUDIO</p><h1>Start creating</h1><p className="copy">Create or open a portable Clipora project. No account is required for the local workspace.</p><div className="actions"><button className="primary" onClick={createProject}><Plus size={17}/> New project</button><button className="secondary" onClick={() => inputRef.current?.click()}><FolderOpen size={17}/> Open project</button><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={e => openProject(e.target.files?.[0])}/></div><Link to="/caption-generator" className="caption-link"><Sparkles size={15}/> Open Caption Generator</Link>{error && <p className="error" role="alert">{error}</p>}</div>}</section><style>{styles}</style></main>
}
const styles=`.editor-shell{min-height:100vh;background:#08090d;color:#f6f7fb;font-family:Inter,system-ui,sans-serif}.editor-shell header{height:64px;padding:0 24px;border-bottom:1px solid #252934;display:flex;align-items:center;justify-content:space-between;color:#7f8798;font-size:12px}.brand{color:#fff;text-decoration:none;font-weight:850;display:flex;align-items:center;gap:8px}.editor-content{min-height:calc(100vh - 64px);display:grid;place-items:center;text-align:center;padding:24px}.empty{width:min(680px,100%);padding:48px 28px;border:1px solid #272b36;border-radius:24px;background:#101218}.icon{width:62px;height:62px;margin:0 auto 18px;border-radius:18px;display:grid;place-items:center;background:#1a1d26;color:#f5c542}.kicker{font-size:11px;letter-spacing:.16em;font-weight:850;color:#9da3b5}.editor-content h1{font-size:42px;letter-spacing:-.045em;margin:8px 0}.copy{max-width:600px;margin:0 auto 24px;color:#969dad;line-height:1.6}.actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.primary,.secondary{border-radius:11px;padding:11px 15px;font-weight:800;text-decoration:none;display:inline-flex;align-items:center;gap:8px;cursor:pointer}.primary{border:1px solid #f5c542;background:#f5c542;color:#111}.secondary{border:1px solid #343947;background:#171a22;color:#fff}.caption-link{display:inline-flex;align-items:center;gap:7px;margin-top:18px;color:#c9ced9;font-size:13px}.error{color:#ff8e8e;font-size:13px}@media(max-width:640px){.editor-shell header span{display:none}.empty{padding:34px 18px}.editor-content h1{font-size:34px}}`