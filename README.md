# Clipora

Open-source, local-first AI video editor with a CapCut-inspired workflow.

## AI Presenter — free/local-first

Clipora includes an **AI Presenter** job builder for Nepali presenter videos. The browser handles the UI and job definition while heavy AI generation stays outside the editor:

```text
Nepali script → Chatterbox Nepali / Nepali VITS → SadTalker → FFmpeg → MP4 → Clipora
```

The recommended zero-cost proof-of-concept is Google Colab for the AI-heavy stages. The current Nepali Chatterbox model documents a T4/free-tier Colab workflow and optional 5–10 second voice cloning. See `presenter/README.md` and `presenter/colab/README.md`.

**Important:** GitHub Pages/mobile browsers cannot realistically run the large PyTorch avatar models themselves. Clipora intentionally keeps generation separate: Colab or a stronger local machine generates the presenter video, then the MP4 is imported into the local editor.

## Vision

Clipora is designed to edit media in the user's browser/device instead of uploading source footage to a central rendering server. The long-term architecture combines a professional multi-track timeline, WebCodecs/WebGPU preview, FFmpeg export, local project storage, and an AI agent that produces safe editor commands.

## Current build

- Responsive dark editor shell inspired by modern mobile/desktop NLE workflows
- Media import with local object URLs
- Video timeline and clip selection
- Play/pause and ±5 second navigation
- Split and delete actions
- Undo/redo history
- Local project persistence
- PWA install/offline shell
- AI command-planning panel
- Browser-local FFmpeg export path
- **AI Presenter job builder with Nepali TTS + SadTalker + FFmpeg pipeline**
- **Portable presenter job JSON export**

## Roadmap: foundation → pro

### Phase 1 — Editor foundation
- [x] Editor shell
- [x] Media import
- [x] Basic timeline
- [x] Selection, split, delete
- [x] Undo/redo
- [x] Local save
- [ ] Multi-track drag/drop
- [ ] Accurate playhead/timeline seeking

### Phase 2 — Professional editing engine
- [ ] Non-destructive trim/ripple editing
- [ ] WebCodecs preview
- [ ] Web Audio mixing
- [ ] Text and graphics layers
- [ ] Transitions and effects
- [ ] Keyframes
- [ ] Waveforms and thumbnails
- [ ] Proxy media for mobile

### Phase 3 — Export
- [ ] Hardware WebCodecs export where supported
- [ ] FFmpeg fallback
- [ ] MP4/WebM presets
- [ ] 720p/1080p/4K presets
- [ ] Export cancellation and recovery
- [ ] Export preflight

### Phase 4 — AI agent
- [ ] Command schema
- [ ] Undoable AI actions
- [ ] Timeline inspection tools
- [ ] Auto highlight selection
- [ ] Silence detection
- [ ] Auto captions
- [ ] Smart reframing
- [ ] AI editing plans with preview/apply
- [ ] User-supplied AI providers
- [ ] Optional local models

### Phase 5 — Creator features
- [ ] 9:16 Shorts/Reels/TikTok workflows
- [ ] Caption presets
- [ ] Templates
- [ ] Brand kits
- [ ] Beat markers
- [ ] Screen/camera recording
- [ ] Subtitle import/export
- [ ] Project import/export

### Phase 6 — Android
- [ ] Capacitor/native shell
- [ ] Native media picker
- [ ] Android share target
- [ ] Native export acceleration where practical
- [ ] Signed APK release through GitHub Releases

## Architecture principles

1. Local-first: source media should remain on the user's device.
2. Non-destructive: timeline state is the source of truth; exports are generated artifacts.
3. Action-based: every edit is an undoable command.
4. Progressive enhancement: WebGPU/WebCodecs when available, safe fallbacks when not.
5. AI is a planner, not an unrestricted file manipulator.
6. Zero mandatory cloud account for core editing.

## License

License will be finalized before the first public production release after auditing all media/codec dependencies and their licenses.
