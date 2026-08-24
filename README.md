# Clipora

Clipora is a **local-first AI video generator** for GitHub Pages and mobile browsers.

## What it does

```text
Prompt
  ↓
Storyboard
  ↓
Script + captions + timing
  ↓
Optional image/video media
  ↓
Canvas renderer
  ↓
WebM video
  ↓
Download
```

No paid AI API key is required for the core generator.

## Current features

- Prompt-to-storyboard generation
- English, Nepali and Hindi templates
- 30/45/60/90 second projects
- 9:16, 16:9, 1:1 and 4:5 formats
- Cinematic, clean, news, energetic and minimal styles
- Editable scene titles, scripts and captions
- Per-scene image/video attachment
- Browser speech preview
- Browser-native video rendering with MediaRecorder
- Progress indicator
- Downloadable WebM output
- Local project saving with localStorage
- Responsive mobile UI
- PWA/offline shell

## Important limitation

The core browser generator is intentionally honest about what it can do without a cloud model: it generates a structured video plan and renders it locally. It does **not** pretend that a free static website can magically generate photorealistic AI images, cloned voices or cinematic text-to-video without model weights or a compute backend.

Those capabilities can be added later through optional local models or user-supplied providers without making an API mandatory for basic video creation.

## Development

The app is a static HTML/CSS/JavaScript project and can be deployed directly with GitHub Pages.

## License

To be finalized before production release.
