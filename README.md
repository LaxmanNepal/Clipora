# Clipora

Open-source, local-first AI video editor with a CapCut-inspired workflow.

## AI Presenter — free/local-first

Clipora now has a complete **AI Presenter package workflow** for Nepali talking-presenter videos:

```text
Clipora script + photo + optional voice
              ↓
      local ZIP package
              ↓
     free Google Colab GPU
              ↓
 Nepali Chatterbox TTS → SadTalker → FFmpeg
              ↓
       final MP4 download
              ↓
       import into Clipora
```

The homepage's **AI Presenter → Create package** button bundles the script, presenter image and optional voice sample. **Open free Colab** launches the repository's ready-made notebook. No paid API key is required.

### Why it is not entirely browser-only

GitHub Pages and normal mobile browsers cannot realistically run the large Python/PyTorch avatar stack. Pretending otherwise would produce a demo that looks good but does not work. Clipora therefore keeps editing local while using a free Colab GPU only for the heavy generation stage.

### Presenter workflow

1. Open Clipora and choose **Presenter**.
2. Enter the Nepali script.
3. Choose 9:16, 16:9 or 1:1.
4. Select a presenter image.
5. Optionally provide a 5–10 second voice sample you have permission to use.
6. Tap **Create package**.
7. Tap **Open free Colab**.
8. Upload `clipora-presenter-package.zip`.
9. Run the notebook cells.
10. Download `clipora-presenter.mp4`.
11. Import that MP4 into Clipora.

The notebook separates the TTS and avatar installation stages because the current SadTalker stack has older dependency pins. This is deliberate: it reduces package conflicts instead of claiming the two model stacks can safely share one modern Python environment.

## Current build

- Responsive dark editor shell
- Local media import and IndexedDB persistence
- Basic video timeline
- Play/pause and ±5 second navigation
- Split and delete
- Undo/redo
- PWA install/offline shell
- AI command-planning panel
- Browser-local FFmpeg export path
- **AI Presenter package builder**
- **Nepali Chatterbox TTS workflow**
- **SadTalker talking-head workflow**
- **FFmpeg 9:16 / 16:9 / 1:1 finalization**
- **One-click free Colab notebook**

## Roadmap

### Editing engine
- [ ] Multi-track drag/drop
- [ ] Accurate playhead/timeline seeking
- [ ] Non-destructive trim/ripple editing
- [ ] WebCodecs preview
- [ ] Web Audio mixing
- [ ] Text/graphics layers
- [ ] Transitions/effects/keyframes
- [ ] Waveforms/thumbnails
- [ ] Proxy media for mobile

### AI editor
- [ ] Undoable AI commands
- [ ] Silence detection
- [ ] Auto captions
- [ ] Smart reframing
- [ ] Highlight selection
- [ ] Local model adapters
- [ ] User-supplied AI providers

### Creator features
- [ ] 9:16 Shorts/Reels workflows
- [ ] Caption presets
- [ ] Templates and brand kits
- [ ] Beat markers
- [ ] Screen/camera recording
- [ ] Subtitle import/export
- [ ] Project import/export

### Android
- [ ] Capacitor/native shell
- [ ] Native media picker
- [ ] Android share target
- [ ] Native export acceleration
- [ ] Signed APK release

## Architecture principles

1. Local-first: source media remains on the user's device until the user explicitly packages it for generation.
2. Non-destructive: timeline state is the source of truth; exports are generated artifacts.
3. Action-based: edits should be undoable commands.
4. Progressive enhancement: use WebGPU/WebCodecs where available and safe fallbacks elsewhere.
5. AI is a planner, not an unrestricted file manipulator.
6. No mandatory paid cloud account for core editing or the presenter workflow.

## License

License will be finalized before the first public production release after auditing all media/codec dependencies and their licenses.
