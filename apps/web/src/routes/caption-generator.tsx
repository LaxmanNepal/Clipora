import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, Download, Film, Play, RotateCcw, Sparkles, Upload, WandSparkles } from 'lucide-react'

export const Route = createFileRoute('/caption-generator')({ component: CaptionGenerator })

type Animation = 'pop' | 'bounce' | 'fade' | 'slide' | 'typewriter' | 'karaoke'
type Word = { text: string; start: number; end: number }
type Caption = { id: number; text: string; start: number; end: number; words: Word[] }

const sampleTranscript = 'Aaja mausam dherai ramro chha. Tapailai pani bahira ghumna man lagcha?'

function makeCaptions(text: string): Caption[] {
  const source = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
  const sentences = source.length ? source : [text.trim() || 'Aaja mausam dherai ramro chha']
  let cursor = 0
  return sentences.map((sentence, index) => {
    const words = sentence.split(/\s+/).filter(Boolean)
    const duration = Math.max(1.8, words.length * 0.42)
    const wordDuration = duration / Math.max(words.length, 1)
    const caption: Caption = {
      id: index + 1,
      text: sentence,
      start: cursor,
      end: cursor + duration,
      words: words.map((word, wordIndex) => ({ text: word, start: cursor + wordIndex * wordDuration, end: cursor + (wordIndex + 1) * wordDuration })),
    }
    cursor += duration + 0.18
    return caption
  })
}

function CaptionGenerator() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [transcript, setTranscript] = useState(sampleTranscript)
  const [captions, setCaptions] = useState<Caption[]>(makeCaptions(sampleTranscript))
  const [selectedId, setSelectedId] = useState(1)
  const [font, setFont] = useState('Inter')
  const [fontSize, setFontSize] = useState(52)
  const [textColor, setTextColor] = useState('#ffffff')
  const [accentColor, setAccentColor] = useState('#f5c542')
  const [stroke, setStroke] = useState(4)
  const [shadow, setShadow] = useState(18)
  const [animation, setAnimation] = useState<Animation>('pop')
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>('bottom')
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center')
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const selected = captions.find((caption) => caption.id === selectedId) ?? captions[0]
  const activeCaption = captions.find((caption) => currentTime >= caption.start && currentTime <= caption.end)
  const activeWordIndex = useMemo(() => activeCaption?.words.findIndex((word) => currentTime >= word.start && currentTime <= word.end) ?? -1, [activeCaption, currentTime])

  const handleVideo = (file?: File) => {
    if (!file || !file.type.startsWith('video/')) return
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(URL.createObjectURL(file))
    setCurrentTime(0)
  }

  const generate = () => {
    const next = makeCaptions(transcript)
    setCaptions(next)
    setSelectedId(next[0]?.id ?? 1)
    setCurrentTime(0)
  }

  const updateSelected = (patch: Partial<Caption>) => {
    if (!selected) return
    setCaptions((items) => items.map((item) => item.id === selected.id ? { ...item, ...patch } : item))
  }

  const togglePlayback = async () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) { await videoRef.current.play(); setIsPlaying(true) }
    else { videoRef.current.pause(); setIsPlaying(false) }
  }

  const seek = (time: number) => {
    setCurrentTime(time)
    if (videoRef.current) videoRef.current.currentTime = time
  }

  const downloadSrt = () => {
    const srt = captions.map((caption, index) => `${index + 1}\n${toSrtTime(caption.start)} --> ${toSrtTime(caption.end)}\n${caption.text}\n`).join('\n')
    downloadBlob(new Blob([srt], { type: 'text/plain;charset=utf-8' }), 'clipora-captions.srt')
  }

  const exportProject = () => {
    const project = { version: 1, type: 'clipora-caption-project', captions, style: { font, fontSize, textColor, accentColor, stroke, shadow, animation, position, align } }
    downloadBlob(new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' }), 'clipora-caption-project.json')
  }

  return (
    <main className="cg-shell">
      <header className="cg-header">
        <div><div className="cg-kicker"><Sparkles size={14} /> CLIPORA STUDIO</div><h1>Animated Caption Generator</h1><p>Turn speech into editable Nenglish captions with word-level animation and precise styling.</p></div>
        <div className="cg-actions"><button className="cg-button secondary" onClick={downloadSrt}><Download size={16} /> SRT</button><button className="cg-button secondary" onClick={exportProject}><Download size={16} /> Project</button><button className="cg-button primary" onClick={() => seek(0)}><Film size={16} /> Preview</button></div>
      </header>

      <section className="cg-workspace">
        <aside className="cg-panel cg-left">
          <div className="cg-panel-title">1 · Media & transcript</div>
          <button className="cg-drop" onClick={() => fileInputRef.current?.click()}><Upload size={25} /><strong>{videoUrl ? 'Replace video' : 'Drop video here'}</strong><span>MP4, WebM, MOV</span></button>
          <input ref={fileInputRef} type="file" accept="video/*" hidden onChange={(e) => handleVideo(e.target.files?.[0])} />
          <label className="cg-label">Transcript / Nenglish</label>
          <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="cg-textarea" />
          <button className="cg-button primary full" onClick={generate}><WandSparkles size={16} /> Auto-generate captions</button>
          <p className="cg-help">The editor is ready for a Whisper/AI endpoint. Connect speech-to-text + Nepali → Nenglish conversion here for full automation.</p>
          <div className="cg-panel-title spaced">Caption clips</div>
          <div className="cg-caption-list">{captions.map((caption) => <button key={caption.id} className={`cg-caption-item ${selectedId === caption.id ? 'selected' : ''}`} onClick={() => { setSelectedId(caption.id); seek(caption.start) }}><span>{formatTime(caption.start)}</span><strong>{caption.text}</strong></button>)}</div>
        </aside>

        <section className="cg-stage-panel">
          <div className="cg-stage-toolbar"><span>{videoUrl ? 'Video preview' : 'Caption preview'}</span><span className="cg-live"><i /> LIVE</span></div>
          <div className="cg-stage-wrap"><div className="cg-stage" style={{ fontFamily: font }}>
            {videoUrl ? <video ref={videoRef} src={videoUrl} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} /> : <div className="cg-empty-video"><Film size={38} /><strong>Upload a video to preview captions on it</strong><span>Or use the built-in caption preview below.</span></div>}
            {activeCaption && <div className={`cg-caption-render anim-${animation}`} style={{ fontSize, color: textColor, textAlign: align, textShadow: `0 4px ${shadow}px rgba(0,0,0,.72), 0 0 ${stroke}px rgba(0,0,0,.95)`, top: position === 'top' ? '12%' : position === 'center' ? '45%' : '78%' }}>{activeCaption.words.map((word, index) => <span key={`${word.text}-${index}`} style={{ color: animation === 'karaoke' && index <= activeWordIndex ? accentColor : textColor }}>{word.text}{index < activeCaption.words.length - 1 ? ' ' : ''}</span>)}</div>}
          </div></div>
          <div className="cg-player"><button className="cg-icon-button" onClick={() => seek(0)} title="Reset"><RotateCcw size={17} /></button><button className="cg-play" onClick={togglePlayback}>{isPlaying ? 'Ⅱ' : <Play size={17} fill="currentColor" />}</button><span className="cg-time">{formatTime(currentTime)} / {formatTime(videoRef.current?.duration || captions.at(-1)?.end || 0)}</span></div>
          <div className="cg-timeline"><div className="cg-track-base" />{captions.map((caption) => <button key={caption.id} className={`cg-track-caption ${selectedId === caption.id ? 'selected' : ''}`} style={{ left: `${(caption.start / Math.max(captions.at(-1)?.end || 1, 1)) * 100}%`, width: `${((caption.end - caption.start) / Math.max(captions.at(-1)?.end || 1, 1)) * 100}%` }} onClick={() => { setSelectedId(caption.id); seek(caption.start) }}>{caption.text}</button>)}<div className="cg-playhead" style={{ left: `${(currentTime / Math.max(captions.at(-1)?.end || 1, 1)) * 100}%` }} /></div>
        </section>

        <aside className="cg-panel cg-right">
          <div className="cg-panel-title">2 · Style & animation</div>
          <label className="cg-label">Selected caption</label><textarea className="cg-textarea compact" value={selected?.text || ''} onChange={(e) => updateSelected({ text: e.target.value })} />
          <ControlRow label="Font"><select value={font} onChange={(e) => setFont(e.target.value)}><option>Inter</option><option>Arial</option><option>Georgia</option><option>monospace</option></select></ControlRow>
          <ControlRow label={`Size · ${fontSize}px`}><input type="range" min="24" max="100" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} /></ControlRow>
          <ControlRow label={`Stroke · ${stroke}px`}><input type="range" min="0" max="10" value={stroke} onChange={(e) => setStroke(Number(e.target.value))} /></ControlRow>
          <ControlRow label={`Shadow · ${shadow}px`}><input type="range" min="0" max="35" value={shadow} onChange={(e) => setShadow(Number(e.target.value))} /></ControlRow>
          <div className="cg-color-row"><label>Text <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} /></label><label>Highlight <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} /></label></div>
          <div className="cg-label">Animation</div><div className="cg-animation-grid">{(['pop','bounce','fade','slide','typewriter','karaoke'] as Animation[]).map((item) => <button key={item} className={animation === item ? 'selected' : ''} onClick={() => setAnimation(item)}>{item}</button>)}</div>
          <div className="cg-label">Position</div><div className="cg-segmented">{(['top','center','bottom'] as const).map((item) => <button key={item} className={position === item ? 'selected' : ''} onClick={() => setPosition(item)}>{item}</button>)}</div>
          <div className="cg-label">Alignment</div><div className="cg-align-row"><button className={align === 'left' ? 'selected' : ''} onClick={() => setAlign('left')}><AlignLeft size={17} /></button><button className={align === 'center' ? 'selected' : ''} onClick={() => setAlign('center')}><AlignCenter size={17} /></button><button className={align === 'right' ? 'selected' : ''} onClick={() => setAlign('right')}><AlignRight size={17} /></button></div>
          <div className="cg-timing"><div><span>Start</span><input type="number" step="0.1" value={selected?.start ?? 0} onChange={(e) => updateSelected({ start: Number(e.target.value) })} /></div><div><span>End</span><input type="number" step="0.1" value={selected?.end ?? 0} onChange={(e) => updateSelected({ end: Number(e.target.value) })} /></div></div>
        </aside>
      </section>
      <footer className="cg-footer"><span><strong>Clipora Caption Engine</strong> · editable captions · word-level animation</span><span>Next: Whisper + Nenglish AI + FFmpeg server rendering</span></footer>
      <style>{styles}</style>
    </main>
  )
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) { return <div className="cg-control"><label>{label}</label>{children}</div> }
function formatTime(seconds: number) { if (!Number.isFinite(seconds)) return '00:00.0'; const minutes = Math.floor(seconds / 60); const rest = seconds % 60; return `${String(minutes).padStart(2,'0')}:${rest.toFixed(1).padStart(4,'0')}` }
function toSrtTime(seconds: number) { const ms = Math.floor((seconds % 1) * 1000); const total = Math.floor(seconds); const s = total % 60; const m = Math.floor(total / 60) % 60; const h = Math.floor(total / 3600); return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(3,'0')}` }
function downloadBlob(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url) }

const styles = `
.cg-shell{min-height:100vh;background:#08090d;color:#f6f7fb;font-family:Inter,system-ui,sans-serif;padding:28px;box-sizing:border-box}.cg-header{max-width:1500px;margin:0 auto 22px;display:flex;justify-content:space-between;gap:24px;align-items:flex-end}.cg-kicker{font-size:11px;letter-spacing:.16em;color:#9da3b5;display:flex;align-items:center;gap:7px}.cg-header h1{font-size:32px;line-height:1.1;margin:7px 0 8px;letter-spacing:-.04em}.cg-header p{margin:0;color:#9298a8;font-size:14px}.cg-actions{display:flex;gap:8px;flex-wrap:wrap}.cg-button{border:1px solid #292d38;background:#151820;color:#f8f9fc;border-radius:10px;padding:10px 14px;font-weight:700;display:flex;gap:8px;align-items:center;cursor:pointer}.cg-button.primary{background:#f5c542;color:#111;border-color:#f5c542}.cg-button.full{width:100%;justify-content:center;margin-top:10px}.cg-workspace{max-width:1500px;margin:auto;display:grid;grid-template-columns:280px minmax(420px,1fr) 290px;gap:12px;min-height:720px}.cg-panel,.cg-stage-panel{border:1px solid #252934;background:#101218;border-radius:16px;overflow:hidden}.cg-panel{padding:16px}.cg-panel-title{font-size:12px;font-weight:800;letter-spacing:.08em;color:#aeb4c3;text-transform:uppercase;margin-bottom:14px}.cg-panel-title.spaced{margin-top:24px}.cg-drop{width:100%;border:1px dashed #3b4050;background:#0c0e13;border-radius:12px;padding:20px 10px;color:#fff;display:flex;flex-direction:column;align-items:center;gap:7px;cursor:pointer}.cg-drop span,.cg-help{font-size:11px;color:#777e8f}.cg-label{display:block;font-size:11px;font-weight:700;color:#aeb4c3;margin:15px 0 7px}.cg-textarea{width:100%;min-height:92px;resize:vertical;background:#0b0d12;border:1px solid #292d37;border-radius:9px;color:#eef0f5;padding:10px;box-sizing:border-box;font:12px/1.55 inherit;outline:none}.cg-textarea.compact{min-height:66px}.cg-help{line-height:1.45;margin:8px 0}.cg-caption-list{display:flex;flex-direction:column;gap:5px;max-height:300px;overflow:auto}.cg-caption-item{border:1px solid transparent;background:#0b0d12;border-radius:9px;padding:9px;text-align:left;color:#dce0e9;cursor:pointer}.cg-caption-item span{display:block;color:#6f7686;font-size:10px;margin-bottom:3px}.cg-caption-item strong{font-size:11px;font-weight:600}.cg-caption-item.selected{border-color:#d1aa37;background:#17150e}.cg-stage-panel{display:flex;flex-direction:column;background:#0b0d11}.cg-stage-toolbar{height:44px;border-bottom:1px solid #252934;padding:0 14px;display:flex;align-items:center;justify-content:space-between;color:#9fa6b6;font-size:11px}.cg-live{color:#dce0e9;display:flex;align-items:center;gap:5px}.cg-live i{width:6px;height:6px;background:#f04b4b;border-radius:50%;display:block}.cg-stage-wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:25px;background:radial-gradient(circle at center,#171a22,#08090d 70%)}.cg-stage{position:relative;width:min(720px,100%);aspect-ratio:16/9;border-radius:10px;overflow:hidden;background:#050609;box-shadow:0 20px 60px #0008}.cg-stage video{width:100%;height:100%;object-fit:contain;display:block}.cg-empty-video{height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:9px;color:#7f8697;font-size:12px;text-align:center}.cg-empty-video strong{color:#b9bfcd}.cg-caption-render{position:absolute;left:5%;width:90%;font-weight:900;line-height:1.08;transform:translateY(-50%);pointer-events:none;word-break:break-word}.anim-pop{animation:cg-pop .28s both}.anim-bounce{animation:cg-bounce .6s both}.anim-fade{animation:cg-fade .35s both}.anim-slide{animation:cg-slide .35s both}.anim-typewriter{animation:cg-fade .2s both}.anim-karaoke{animation:cg-pop .2s both}@keyframes cg-pop{from{opacity:0;transform:translateY(-50%) scale(.7)}to{opacity:1;transform:translateY(-50%) scale(1)}}@keyframes cg-bounce{0%{transform:translateY(-50%) scale(.8)}60%{transform:translateY(-50%) scale(1.08)}100%{transform:translateY(-50%) scale(1)}}@keyframes cg-fade{from{opacity:0}to{opacity:1}}@keyframes cg-slide{from{opacity:0;transform:translate(-20px,-50%)}to{opacity:1;transform:translate(0,-50%)}}.cg-player{height:52px;border-top:1px solid #252934;display:flex;align-items:center;justify-content:center;gap:12px}.cg-icon-button,.cg-play{border:0;background:transparent;color:#bfc5d2;cursor:pointer}.cg-play{width:32px;height:32px;border-radius:50%;background:#f5c542;color:#111;display:grid;place-items:center}.cg-time{font:11px ui-monospace,monospace;color:#7f8697}.cg-timeline{height:92px;border-top:1px solid #252934;position:relative;padding:32px 14px 0;box-sizing:border-box;overflow:hidden}.cg-track-base{position:absolute;left:14px;right:14px;top:48px;height:2px;background:#303542}.cg-track-caption{position:absolute;top:35px;height:27px;min-width:4px;border:1px solid #474d5c;background:#252a35;color:#b8bfcc;border-radius:5px;font-size:9px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 6px;cursor:pointer}.cg-track-caption.selected{background:#6d571a;border-color:#e0b73e;color:#fff}.cg-playhead{position:absolute;top:27px;width:1px;height:42px;background:#f04b4b;pointer-events:none}.cg-control{margin:12px 0}.cg-control label{display:block;font-size:10px;color:#8f96a7;margin-bottom:6px}.cg-control select,.cg-timing input{width:100%;background:#0b0d12;border:1px solid #292d37;border-radius:7px;color:#e8ebf1;padding:8px;font-size:11px;box-sizing:border-box}.cg-control input[type=range]{width:100%;accent-color:#f5c542}.cg-color-row{display:flex;gap:8px}.cg-color-row label{flex:1;font-size:10px;color:#9299a9;display:flex;align-items:center;justify-content:space-between}.cg-color-row input{width:30px;height:24px;padding:0;border:0;background:transparent}.cg-animation-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}.cg-animation-grid button,.cg-segmented button,.cg-align-row button{background:#0b0d12;border:1px solid #292d37;color:#9299a9;border-radius:7px;padding:8px;font-size:10px;text-transform:capitalize;cursor:pointer}.cg-animation-grid button.selected,.cg-segmented button.selected,.cg-align-row button.selected{border-color:#d2aa3c;background:#211c0d;color:#f5d77a}.cg-segmented{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.cg-align-row{display:flex;gap:5px}.cg-align-row button{flex:1;display:grid;place-items:center}.cg-timing{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:16px}.cg-timing span{display:block;color:#777e8d;font-size:9px;margin-bottom:4px}.cg-footer{max-width:1500px;margin:12px auto 0;display:flex;justify-content:space-between;color:#606777;font-size:10px}.cg-footer strong{color:#9299a8}@media(max-width:1100px){.cg-workspace{grid-template-columns:240px minmax(360px,1fr)}.cg-right{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.cg-right .cg-panel-title,.cg-right .cg-textarea{grid-column:1/-1}}@media(max-width:760px){.cg-shell{padding:14px}.cg-header{display:block}.cg-actions{margin-top:14px}.cg-workspace{display:flex;flex-direction:column}.cg-left{order:2}.cg-stage-panel{order:1;min-height:500px}.cg-right{order:3;display:block}.cg-footer{display:none}.cg-stage-wrap{padding:10px}.cg-header h1{font-size:26px}}
`
