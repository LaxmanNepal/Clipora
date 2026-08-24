# Clipora

Open-source, local-first AI video editor with a CapCut-inspired workflow.

## AI Presenter — free/local-first

Clipora has a complete **AI Presenter package workflow** for Nepali talking-presenter videos:

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

The homepage's **AI Presenter → Create package** button creates the package entirely in the browser. The current package builder does not depend on JSZip or another runtime CDN: it writes the ZIP container locally with the browser's Web APIs. **Open free Colab** launches the repository's ready-made notebook. No paid API key is required.

### Why it is not entirely browser-only

GitHub Pages and normal mobile browsers cannot realistically run the large Python/PyTorch avatar stack. Clipora therefore keeps editing local while using a free Colab GPU only for the heavy generation stage.

### Presenter workflow

1. Open Clipora and choose **Presenter**.
2. Enter the Nepali script.
3. Choose 9:16, 16:9 or 1:1.
4. Select a presenter image.
5. Optionally provide a 5–10 second voice sample you have permission to use.
6. Confirm media rights.
7. Tap **Create package**.
8. Tap **Open free Colab**.
9. Upload `clipora-presenter-package.zip`.
10. Run the notebook cells.
11. Download `clipora-presenter.mp4`.
12. Import that MP4 into Clipora.

### Reliability work

The upstream Nepali Chatterbox model currently documents a T4/free-tier Colab path, the `ChatterboxMultilingualTTS` loader, the Nepali fine-tuned `t3_mtl_nepali_final.safetensors` weights, and optional short reference-voice cloning. The model also requires accepting its current Hugging Face access conditions before the fine-tuned weights can be downloaded.

SadTalker currently publishes an older dependency stack, including pinned NumPy/scikit-image-era packages. Its repository also documents separate checkpoint downloads. Clipora therefore treats the TTS and avatar stages as separate dependency-sensitive stages and includes a BasicSR/modern-Torchvision compatibility repair in the documented setup. This is deliberate; blindly installing SadTalker's requirements after Chatterbox can downgrade or replace the TTS runtime.

### Package format

```text
clipora-presenter-package.zip
├── clipora-presenter-job.json
├── README.txt
└── media/
    ├── presenter.jpg
    └── voice.wav          (optional)
```

The browser refuses packages above 180 MB to avoid mobile-memory failures. Source media is not sent to Clipora's servers by the package builder.

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
- **Local ZIP generation — no runtime ZIP CDN dependency**
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
