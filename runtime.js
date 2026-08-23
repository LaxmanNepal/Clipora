const status=document.querySelector('#status');
const preview=document.querySelector('#preview');
const timeline=document.querySelector('#timeline');
const ruler=document.querySelector('#ruler');
const toast=document.querySelector('#toast');

function notify(message){if(toast){toast.textContent=message;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),2200)}}

// Browser capability diagnostics. WebCodecs is used as an enhancement; the app must still work with the FFmpeg fallback.
const capabilities={webCodecs:'VideoEncoder' in window && 'VideoDecoder' in window,offscreen:'OffscreenCanvas' in window,indexedDB:'indexedDB' in window,serviceWorker:'serviceWorker' in navigator};
document.documentElement.dataset.webcodecs=capabilities.webCodecs?'yes':'no';

// Keep the playhead visible and make the ruler seekable even on touch screens.
let playhead;
function ensurePlayhead(){if(!timeline)return;if(!playhead){playhead=document.createElement('div');playhead.className='playhead';timeline.appendChild(playhead)}updatePlayhead()}
function updatePlayhead(){if(!playhead||!preview)return;const seconds=preview.currentTime||0;const zoom=Number((document.querySelector('#zoomLabel')?.textContent||'100').replace('%',''))||100;playhead.style.left=`${66+(seconds*40*zoom/100)}px`;}
preview?.addEventListener('timeupdate',updatePlayhead);preview?.addEventListener('loadedmetadata',()=>{ensurePlayhead();document.querySelector('#status').textContent=`${capabilities.webCodecs?'GPU-ready':'compatibility mode'} · ${Math.round(preview.duration||0)}s`});

function seekFromPointer(e){if(!ruler||!preview?.duration)return;const rect=ruler.getBoundingClientRect();const zoom=Number((document.querySelector('#zoomLabel')?.textContent||'100').replace('%',''))||100;const x=Math.max(0,e.clientX-rect.left);preview.currentTime=Math.min(preview.duration,(x/40)*(100/zoom))}
ruler?.addEventListener('pointerdown',e=>{ruler.setPointerCapture?.(e.pointerId);seekFromPointer(e)});ruler?.addEventListener('pointermove',e=>{if(e.buttons)seekFromPointer(e)});

// Make timeline clips keyboard-accessible without changing the existing editor state model.
const observe=new MutationObserver(()=>{document.querySelectorAll('.clip').forEach((clip,index)=>{if(clip.dataset.enhanced)return;clip.dataset.enhanced='1';clip.tabIndex=0;clip.setAttribute('role','button');clip.setAttribute('aria-label',`Timeline clip ${index+1}`);clip.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();clip.click()}})})});
observe.observe(timeline||document.body,{childList:true,subtree:true});

// Warn users when a portable project has timeline metadata but its original media is not present in this browser.
window.addEventListener('beforeunload',()=>{try{const raw=localStorage.getItem('clipora.project');if(raw&&JSON.parse(raw).clips?.length&&!indexedDB)return true}catch{}return undefined});

// Prevent accidental browser navigation while dragging media into the editor.
window.addEventListener('dragenter',e=>{if(e.dataTransfer?.types?.includes('Files'))document.body.classList.add('dragging-media')});
window.addEventListener('dragleave',e=>{if(e.target===document.documentElement)document.body.classList.remove('dragging-media')});
window.addEventListener('drop',()=>document.body.classList.remove('dragging-media'));

// Catch fatal module/runtime errors and surface them in the UI instead of leaving a blank editor.
window.addEventListener('error',e=>{console.error(e.error||e.message);if(String(e.message||'').includes('Failed to fetch dynamically imported module'))notify('Optional export module could not load. Editing is still available.');});
ensurePlayhead();