# Clipora AI Presenter

Clipora now includes a free/local-first AI Presenter job builder. The browser creates a small JSON job description; heavy generation is intentionally kept outside the editor so Clipora remains local-first and works on mobile.

## Current pipeline

```text
Nepali script
   ↓
Chatterbox Nepali TTS (or Nepali VITS)
   ↓
output.wav
   ↓
SadTalker (presenter image + audio)
   ↓
raw presenter video
   ↓
FFmpeg
   ↓
final MP4
   ↓
Import into Clipora
```

The current recommended free path is Google Colab for the AI-heavy steps. The Nepali Chatterbox model documents a T4/free-tier Colab workflow and supports a 5–10 second voice reference for zero-shot voice cloning. Model access currently requires accepting the Hugging Face model conditions.

## Important limitation

The Clipora web app cannot run these large Python/PyTorch avatar models inside GitHub Pages or a normal mobile browser. Do not pretend the browser is doing the generation. The browser creates the job and edits the resulting media; Colab/local Python performs generation.

## Input requirements

- A clear presenter image you are authorized to use.
- A Nepali script.
- Optional 5–10 second authorized voice reference for voice cloning.
- A free Google Colab runtime or a stronger local NVIDIA GPU for practical generation.

## Output

Generate an MP4, then import it through Clipora's normal Media workflow. Use 9:16 for Shorts/Reels/TikTok or 16:9 for standard YouTube.

## Local generation

For a stronger machine, install Python, FFmpeg and the selected model repositories locally. SadTalker documents Windows/WSL installation and requires its model checkpoints. See `colab/README.md` for the zero-cost first test.
