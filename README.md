# Clipora

**Clipora** is an open-source video creation platform focused on fast, editable, animated captions for Nepali, Nepanglish, Hindi, and English creators.

> Built on the OpenCut rewrite foundation, with Clipora-specific product direction and branding.

## Product direction

Clipora is being developed as an **AI caption and short-video editor** first. The initial product priorities are:

1. Import video and audio.
2. Generate or import captions with word-level timing.
3. Edit captions visually on a timeline.
4. Apply animated caption templates.
5. Support Nepali, Roman Nepali/Nepanglish, Hindi, and English workflows.
6. Export creator-ready videos for Shorts, Reels, TikTok, and YouTube.

Full multi-track editing, desktop/mobile clients, plugins, automation, and AI-agent integrations are longer-term goals—not promises that the current build already fulfils.

## Architecture

```text
Clipora
├── apps/web       React + Vite editor and web experience
├── apps/api       Cloudflare Worker API / control plane
├── apps/desktop   Rust desktop client
├── Cargo.toml     Rust workspace
└── brand/         Clipora-owned brand assets
```

The long-term architecture separates the editor/control plane from heavyweight media processing. Video rendering should run in a dedicated render worker rather than inside a request-bound Cloudflare Worker.

## Development

The repository uses Proto, Moon, Bun, Rust, and the platform-specific toolchains pinned in `.prototools`.

```sh
proto use
moon run web:dev
moon run api:dev
moon run desktop:dev
```

Web development runs on `http://localhost:5173` and the API development server on `http://localhost:8787`.

## Quality bar

Before merging production work, verify:

- type checking and tests pass
- web build succeeds
- API build succeeds
- Rust workspace checks succeed
- no OpenCut branding remains in user-facing Clipora surfaces
- no secrets are committed
- production dependencies are pinned

## Licensing and attribution

Clipora retains the MIT license and required attribution from the upstream OpenCut-derived codebase. See [`LICENSE`](LICENSE).

Clipora-specific changes, assets, and documentation are maintained in this repository.

## Status

**Early development.** The editor architecture is being stabilized before production launch. Do not treat the repository as feature-complete.
