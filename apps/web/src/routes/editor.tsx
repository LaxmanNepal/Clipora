import { Link, createFileRoute } from '@tanstack/react-router'
import { Download, Film, FolderOpen, Plus, Sparkles, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { isSupportedMedia, readMediaMetadata } from '../lib/media-engine'
import { createProject, type CliporaProject, validateProject } from '../lib/project-model'

export const Route = createFileRoute('/editor')({ component: Editor })

function Editor() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [project, setProject] = useState<CliporaProject | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const persist = (next: CliporaProject) => {
    const updated = { ...next, updatedAt: new Date().toISOString() }
    setProject(updated)
    localStorage.setItem('clipora:last-project', JSON.stringify(updated))
  }

  const newProject = () => { setProject(createProject()); setError(''); setPreviewUrl(null); localStorage.removeItem('clipora:last-project') }

  const openProject = async (file?: File) => {
    if (!file) return
    try {
      const data: unknown = JSON.parse(await file.text())
      if (!validateProject(data)) throw new Error('Invalid Clipora project file or unsupported project version.')
      persist(data)
      setError('')
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not open project.') }
  }

  const importMedia = async (files: FileList | File[]) => {
    if (!project) return
    const selected = Array.from(files)
    if (!selected.length) return
    setBusy(true); setError('')
    try {
      const assets = []
      for (const file of selected) {
        if (!isSupportedMedia(file)) continue
        const metadata = await readMediaMetadata(file)
        const id = crypto.randomUUID()
        assets.push({ id, name: file.name, type: metadata.kind, mimeType: metadata.mimeType, duration: metadata.duration, size: file.size, createdAt: new Date().toISOString() })
        if (!previewUrl && metadata.kind === 'video') setPreviewUrl(URL.createObjectURL(file))
      }
      if (!assets.length) throw new Error('No supported media files were selected.')
      const start = project.duration
      const clips = assets.map((asset, index) => ({ id: crypto.randomUUID(), assetId: asset.id, start: start + assets.slice(0, index).reduce((sum, a) => sum + a.duration, 0), duration: asset.duration, offset: 0 }))
      const addedDuration = assets.reduce((sum, asset) => sum + asset.duration, 0)
      persist({ ...project, assets: [...project.assets, ...assets], clips: [...project.clips, ...clips], duration: start + addedDuration })
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not import media.') }
    finally { setBusy(false) }
  }

  const downloadProject = () => {
    if (!project) return
    const blob = new Blob([JSON.stringify({ ...project, updatedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url
    anchor.download = `${project.name.replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '') || 'clipora-project'}.clipora.json`; anchor.click(); URL.revokeObjectURL(url)
  }

  return <main className="editor-shell">
    <header className="editor-header"><Link to="/" className="brand"><Sparkles size={18} /> Clipora</Link><div className="header-actions"><span>{busy ? 'Reading media…' : 'Local-first workspace'}</span>{project && <button className="secondary" onClick={downloadProject}><Download size={15} /> Save project</button>}</div></header>
    <section className="editor-content">
      {!project ? <div className="empty"><div className="icon"><Film size={30} /></div><p className="kicker">CLIPORA STUDIO</p><h1>Start creating</h1><p className="copy">Create or open a portable Clipora project, then import your video, audio and images directly in the browser.</p><div className="actions"><button className="primary" onClick={newProject}><Plus size={17} /> New project</button><button className="secondary" onClick={() => inputRef.current?.click()}><FolderOpen size={17} /> Open project</button><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={e => openProject(e.target.files?.[0])}/></div><Link to="/caption-generator" className="caption-link"><Sparkles size={15}/> Open Caption Generator</Link>{error && <p className="error" role="alert">{error}</p>}</div> : <div className="project">
        <div className="project-head"><div><p className="kicker">CLIPORA PROJECT</p><h1>{project.name}</h1><p className="copy">{project.assets.length} assets · {project.clips.length} clips · {project.captions.length} caption segments · {project.duration.toFixed(1)}s</p></div><div className="project-actions"><label className="primary"><Upload size={16}/> {busy ? 'Importing…' : 'Import media'}<input hidden type="file" multiple accept="video/*,audio/*,image/*" disabled={busy} onChange={e => importMedia(e.target.files ?? [])}/></label><Link to="/caption-generator" className="secondary"><Sparkles size={16}/> Caption Studio</Link></div></div>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="workspace-grid"><section className="panel preview"><div className="panel-title">Preview</div><div className="preview-stage">{previewUrl ? <video src={previewUrl} controls playsInline /> : <><Film size={28}/><span>Import a video to preview it</span></>}</div></section><section className="panel media"><div className="panel-title">Media · {project.assets.length}</div>{project.assets.length ? <div className="asset-list">{project.assets.map(asset => <div className="asset" key={asset.id}><span className="asset-kind">{asset.type.toUpperCase()}</span><span className="asset-name">{asset.name}</span><span>{asset.duration ? `${asset.duration.toFixed(1)}s` : `${Math.round(asset.size / 1024)} KB`}</span></div>)}</div> : <div className="panel-empty">Import video, audio or image files to populate the media bin.</div>}</section><section className="panel timeline"><div className="panel-title">Timeline</div><div className="timeline-ruler"><span>0:00</span><span>0:05</span><span>0:10</span><span>0:15</span><span>0:20</span></div><div className="tracks"><div className="track"><span>VIDEO</span><div>{project.clips.map(clip => <i key={clip.id} style={{ left: `${clip.start / Math.max(project.duration || 20, 20) * 100}%`, width: `${Math.max(clip.duration / Math.max(project.duration || 20, 20) * 100, 2)}%` }}>{project.assets.find(a => a.id === clip.assetId)?.name}</i>)}</div></div><div className="track"><span>CAPTIONS</span><div /></div></div>{!project.clips.length && <p className="panel-empty">Import media to create timeline clips automatically.</p>}</section></div>
      </div>}
    </section><style>{styles}</style>
  </main>
}
const styles = `.editor-shell{min-height:100vh;background:#08090d;color:#f6f7fb;font-family:Inter,system-ui,sans-serif}.editor-header{height:64px;padding:0 22px;border-bottom:1px solid #252934;display:flex;align-items:center;justify-content:space-between}.brand{color:#fff;text-decoration:none;font-weight:850;display:flex;align-items:center;gap:8px}.header-actions,.project-actions{display:flex;align-items:center;gap:10px;color:#7f8798;font-size:12px}.editor-content{min-height:calc(100vh - 64px);padding:28px}.empty{width:min(680px,100%);margin:10vh auto 0;padding:48px 28px;text-align:center;border:1px solid #272b36;border-radius:24px;background:#101218}.icon{width:62px;height:62px;margin:0 auto 18px;border-radius:18px;display:grid;place-items:center;background:#1a1d26;color:#f5c542}.kicker{font-size:11px;letter-spacing:.16em;font-weight:850;color:#9da3b5}.empty h1,.project h1{font-size:42px;letter-spacing:-.045em;margin:8px 0}.copy{color:#969dad;line-height:1.6}.empty .copy{max-width:600px;margin:0 auto 24px}.actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.primary,.secondary{border-radius:11px;padding:10px 14px;font-weight:800;text-decoration:none;display:inline-flex;align-items:center;gap:8px;cursor:pointer}.primary{border:1px solid #f5c542;background:#f5c542;color:#111}.secondary{border:1px solid #343947;background:#171a22;color:#fff}.caption-link{display:inline-flex;align-items:center;gap:7px;margin-top:18px;color:#c9ced9;font-size:13px}.error{color:#ff8e8e;font-size:13px}.project{max-width:1400px;margin:0 auto}.project-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:18px}.project-head h1{margin:4px 0}.project-head .copy{margin:0}.project-actions input{display:none}.workspace-grid{display:grid;grid-template-columns:1.6fr 1fr;grid-template-rows:420px 250px;gap:14px}.panel{border:1px solid #272b36;background:#101218;border-radius:16px;overflow:hidden}.panel-title{height:44px;padding:0 15px;display:flex;align-items:center;border-bottom:1px solid #272b36;font-size:12px;font-weight:850;color:#cfd3dc}.preview-stage{height:calc(100% - 44px);display:grid;place-content:center;justify-items:center;gap:10px;color:#737b8d;background:#0b0d12}.preview-stage video{width:100%;height:100%;object-fit:contain}.preview-stage span,.panel-empty{font-size:12px;color:#737b8d}.asset-list{padding:8px}.asset{display:grid;grid-template-columns:44px 1fr auto;gap:8px;align-items:center;padding:10px 8px;border-bottom:1px solid #20232c;font-size:11px;color:#858da0}.asset-kind{font-size:8px;color:#f5c542;font-weight:900}.asset-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#d8dbe3}.panel-empty{padding:18px;line-height:1.5}.timeline{grid-column:1/-1}.timeline-ruler{height:32px;display:flex;justify-content:space-around;align-items:center;font-size:10px;color:#666e80;border-bottom:1px solid #222630}.track{display:grid;grid-template-columns:80px 1fr;min-height:52px;border-bottom:1px solid #222630}.track>span{display:flex;align-items:center;padding-left:12px;font-size:9px;color:#7d8596}.track>div{position:relative;margin:8px;border-radius:5px;background:#0b0d12;overflow:hidden}.track i{position:absolute;top:3px;height:34px;border-radius:4px;background:#3a3f4d;border:1px solid #5a6070;padding:8px;font-style:normal;font-size:9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff}.timeline .panel-empty{padding:12px}@media(max-width:800px){.editor-content{padding:16px}.header-actions>span{display:none}.project-head{display:block}.project-actions{margin-top:12px;flex-wrap:wrap}.workspace-grid{display:flex;flex-direction:column}.preview{height:300px}.media{min-height:160px}.timeline{min-height:260px}.empty h1,.project h1{font-size:34px}}`
