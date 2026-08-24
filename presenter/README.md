# Clipora AI Presenter

Clipora includes a free/local-first AI Presenter job builder. The browser creates a small JSON job description; heavy generation stays outside the editor so Clipora remains local-first and works on mobile.

## Pipeline

```text
Nepali script → Chatterbox Nepali / Nepali VITS → SadTalker → FFmpeg → MP4 → Clipora
```

The recommended zero-cost proof-of-concept is Google Colab for the AI-heavy stages. The current Nepali Chatterbox model documents a T4/free-tier Colab workflow and supports a 5–10 second voice reference for zero-shot voice cloning.

## Important limitation

The Clipora web app cannot realistically run large Python/PyTorch avatar models inside GitHub Pages or a normal mobile browser. Clipora creates the job and edits the resulting media; Colab or a stronger local machine performs generation.

## Inputs

- Clear presenter image you are authorized to use.
- Nepali script.
- Optional 5–10 second authorized voice reference.
- Free Colab runtime or a stronger local NVIDIA GPU for practical generation.

See `colab/README.md` for the first free test.
