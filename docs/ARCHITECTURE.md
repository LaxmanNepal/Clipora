# Clipora architecture

## Product boundary

Clipora's first production milestone is an AI-assisted caption and short-video editor. Do not add desktop/mobile/plugins/agent features until the web editing path is reliable.

## System boundaries

```text
Browser editor
  ├─ local project state / autosave
  ├─ media preview
  └─ API client
          │
          ▼
Clipora API (Cloudflare Worker)
  ├─ auth/session boundary
  ├─ project metadata
  ├─ upload orchestration
  └─ render job submission
          │
          ▼
Queue / render service
  ├─ transcription
  ├─ word timestamps
  ├─ caption composition
  └─ FFmpeg/WebCodecs rendering
          │
          ▼
Object storage
  ├─ source media
  ├─ project snapshots
  └─ exported media
```

## Canonical project model

The editor should converge on a versioned project document containing:

- project metadata
- canvas/aspect ratio
- assets
- tracks
- clips
- caption segments and word timing
- text style/template references
- keyframes/effects
- export settings

Every persisted document must include a schema version so migrations can be added without destroying projects.

## Rendering rule

The Cloudflare Worker is the control plane. It must not become the heavy video renderer. Large media processing belongs in a dedicated worker/service with bounded CPU, memory, timeout, retry, and storage behavior.

## Reliability requirements

- Autosave with debounce and explicit save status.
- Local recovery snapshot before destructive timeline operations.
- Idempotent upload and render job IDs.
- Retry only safe/idempotent operations.
- User-visible render progress and failure reasons.
- Deterministic sample media for automated tests.

## Security requirements

- Never commit credentials.
- Validate uploaded media type and size before processing.
- Treat uploaded filenames as untrusted data.
- Enforce project ownership on every API mutation.
- Use signed/short-lived media URLs where possible.
- Keep render workers isolated from the public request path.

## Branding rule

User-facing Clipora code must not reference OpenCut domains, OpenCut branding, OpenCut product names, or upstream social links except where legally required attribution belongs in licensing/attribution documentation.
