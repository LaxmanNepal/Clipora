# Free Google Colab test

Use this as the zero-cost proof-of-concept for Clipora's AI Presenter.

## 1. Nepali TTS

Current recommended model: `Imbatmann/chatterbox-nepali-tts`. Its model card currently documents a Google Colab T4/free-tier workflow, Nepali language support and optional 5–10 second voice cloning.

Install:

```bash
pip install -q git+https://github.com/Imbatmann/chatterbox-nepali.git safetensors librosa
```

Load the base Chatterbox multilingual model and the Nepali fine-tuned checkpoint as documented by the model card, then generate:

```python
wav = model.generate(
    text="तपाईंको नेपाली स्क्रिप्ट यहाँ राख्नुहोस्।",
    language_id="ne",
    audio_prompt_path="ref.wav",
    exaggeration=0.5,
    temperature=0.8,
)
```

Save it as `output.wav`.

## 2. Talking presenter

Clone SadTalker:

```bash
git clone https://github.com/OpenTalker/SadTalker.git
cd SadTalker
```

Follow its current checkpoint/model download instructions, then run the image + `output.wav` workflow.

## 3. Finalize with FFmpeg

For 9:16 output:

```bash
ffmpeg -i result.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -r 30 -c:v libx264 -c:a aac -movflags +faststart clipora-presenter.mp4
```

## 4. Import

Open Clipora → Media → Import media → select `clipora-presenter.mp4`.

## Notes

- Free Colab GPU availability is not guaranteed.
- Hugging Face model access may require accepting current model conditions.
- Only use presenter images and voice references you have permission to process.
- Save intermediate WAV/MP4 files before restarting a runtime.
