import { Link, createFileRoute } from '@tanstack/react-router'
import { Download, Film, FolderOpen, Plus, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import { createProject, type CliporaProject, validateProject } from '../lib/project-model'

export const Route = createFileRoute('/editor')({ component: Editor })

function Editor() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [project, setProject] = useState<CliporaProject | null>(null)
  const [error, setError] = useState('')

  const newProject = () => {
    const next = createProject()
    setProject(next)
    setError('')
    localStorage.setItem('clipora:last-project', JSON.stringify(next))
  }

  const openProject = async (file?: File) => {
    if (!file) return
    try {
      const data: unknown = JSON.parse(await file.text())
      if (!validateProject(data)) throw new Error('Invalid Clipora project file or unsupported project version.')
      setProject(data)
      setError('')
      localStorage.setItem('clipora:last-project', JSON.stringify(data))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open project.')
    }
  }

  const downloadProject = () => {
    if (!project) return
    const blob = new Blob([JSON.stringify({ ...project, updatedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${project.name.replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '') || 'clipora-project'}.clipora.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="editor-shell">
      <header className="editor-header">
        <Link to="/" className="brand"><Sparkles size={18} /> Clipora</Link>
        <div className="header-actions">
          <span>Local-first workspace</span>
          {project && <button className="secondary" onClick={downloadProject}><Download size={15} /> Save project</button>}
        </div>
      </header>
      <section className="editor-content">
        {!project ? (
          <div className="empty">
            <div className="icon"><Film size={30} /></div>
            <p className="kicker">CLIPORA STUDIO</p>
            <h1>Start creating</h1>
            <p className="copy">Create or open a portable Clipora project. Projects are versioned so future editor updates can migrate them safely.</p>
            <div className="actions">
              <button className="primary" onClick={newProject}><Plus size={17} /> New project</button>
              <button className="secondary" onClick={() => inputRef.current?.click()}><FolderOpen size={17} /> Open project</button>
              <input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={e => openProject(e.target.files?.[0])} />
            </div>
            <Link to="/caption-generator" className="caption-link"><Sparkles size={15} /> Open Caption Generator</Link>
            {error && <p className="error" role="alert">{error}</p>}
          </div>
        ) : (
          <div className="project">
            <div className="project-head">
              <div>
                <p className="kicker">CLIPORA PROJECT</p>
                <h1>{project.name}</h1>
                <p className="copy">{project.assets.length} media assets · {project.clips.length} timeline clips · {project.captions.length} caption segments</p>
              </div>
              <Link to="/caption-generator" className="primary"><Sparkles size={16} /> Caption Studio</Link>
            </div>
            <div className="workspace-grid">
              <section className="panel preview"><div className="panel-title">Preview</div><div className="preview-stage"><Film size={28} /><span>Import media to begin preview</span></div></section>
              <section className="panel media"><div className="panel-title">Media</div><div className="panel-empty">Your imported video, audio and image assets will appear here.</div></section>
              <section className="panel timeline"><div className="panel-title">Timeline</div><div className="timeline-ruler"><span>0:00</span><span>0:05</span><span>0:10</span><span>0:15</span><span>0:20</span></div><div className="track"><span>VIDEO</span><div /></div><div className="track"><span>CAPTIONS</span><div /></div><p className="panel-empty">Timeline foundation ready — media and caption clips will populate these tracks.</p></section>
            </div>
          </div>
        )}
      </section>
      <style>{styles}</style>
    </main>
  )
}

const styles = `.editor-shell{min-height:100vh;background:#08090d;color:#f6f7fb;font-family:Inter,system-ui,sans-serif}.editor-header{height:64px;padding:0 22px;border-bottom:1px solid #252934;display:flex;align-items:center;justify-content:space-between}.brand{color:#fff;text-decoration:none;font-weight:850;display:flex;align-items:center;gap:8px}.header-actions{display:flex;align-items:center;gap:14px;color:#7f8798;font-size:12px}.header-actions button{font:inherit}.editor-content{min-height:calc(100vh - 64px);padding:28px}.empty{width:min(680px,100%);margin:10vh auto 0;padding:48px 28px;text-align:center;border:1px solid #272b36;border-radius:24px;background:#101218}.icon{width:62px;height:62px;margin:0 auto 18px;border-radius:18px;display:grid;place-items:center;background:#1a1d26;color:#f5c542}.kicker{font-size:11px;letter-spacing:.16em;font-weight:850;color:#9da3b5}.empty h1,.project h1{font-size:42px;letter-spacing:-.045em;margin:8px 0}.copy{color:#969dad;line-height:1.6}.empty .copy{max-width:600px;margin:0 auto 24px}.actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.primary,.secondary{border-radius:11px;padding:10px 14px;font-weight:800;text-decoration:none;display:inline-flex;align-items:center;gap:8px;cursor:pointer}.primary{border:1px solid #f5c542;background:#f5c542;color:#111}.secondary{border:1px solid #343947;background:#171a22;color:#fff}.caption-link{display:inline-flex;align-items:center;gap:7px;margin-top:18px;color:#c9ced9;font-size:13px}.error{color:#ff8e8e;font-size:13px}.project{max-width:1400px;margin:0 auto}.project-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:22px}.project-head h1{margin:4px 0}.project-head .copy{margin:0}.workspace-grid{display:grid;grid-template-columns:1.6fr 1fr;grid-template-rows:420px 250px;gap:14px}.panel{border:1px solid #272b36;background:#101218;border-radius:16px;overflow:hidden}.panel-title{height:44px;padding:0 15px;display:flex;align-items:center;border-bottom:1px solid #272b36;font-size:12px;font-weight:850;color:#cfd3dc}.preview{grid-row:span 1}.preview-stage{height:calc(100% - 44px);display:grid;place-content:center;justify-items:center;gap:10px;color:#737b8d;background:#0b0d12}.preview-stage span,.panel-empty{font-size:12px;color:#737b8d}.media{height:100%}.media .panel-empty{padding:20px;line-height:1.5}.timeline{grid-column:1/-1}.timeline-ruler{height:32px;display:flex;justify-content:space-around;align-items:center;font-size:10px;color:#666e80;border-bottom:1px solid #222630}.track{display:grid;grid-template-columns:80px 1fr;min-height:46px;border-bottom:1px solid #222630}.track>span{display:flex;align-items:center;padding-left:12px;font-size:9px;color:#7d8596}.track>div{margin:8px;border-radius:5px;background:#181c26}.timeline .panel-empty{padding:12px}.@media(max-width:800px){.editor-content{padding:16px}.header-actions>span{display:none}.project-head{display:block}.project-head .primary{margin-top:12px}.workspace-grid{display:flex;flex-direction:column}.preview{height:300px}.media{min-height:160px}.timeline{min-height:260px}.empty h1,.project h1{font-size:34px}}`
