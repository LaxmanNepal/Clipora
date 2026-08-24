# Free Google Colab test

This is the zero-cost proof-of-concept path for Clipora's AI Presenter. It uses the current Nepali Chatterbox model for speech and SadTalker for the talking-head stage.

## 1. Nepali TTS

Use the current model:

`Imbatmann/chatterbox-nepali-tts`

The model card currently provides a Google Colab T4/free-tier workflow. It supports Nepali (`ne`) and optional 5–10 second voice cloning.

Install in a Colab GPU cell:

```bash
pip install -q git+https://github.com/Imbatmann/chatterbox-nepali.git safetensors librosa
```

Then load the base Chatterbox multilingual model and the Nepali fine-tuned checkpoint as documented by the model card. Generate `output.wav` with:

```python
wav = model.generate(
    text="तपाईंको नेपाली स्क्रिप्ट यहाँ राख्नुहोस्।",
    language_id="ne",
    audio_prompt_path="ref.wav",
    exaggeration=0.5,
    temperature=0.8,
)
```

Save it as a 24 kHz WAV.

## 2. Talking presenter

Clone SadTalker:

```bash
git clone https://github.com/OpenTalker/SadTalker.git
cd SadTalker
```

Follow its current checkpoint/model download instructions, then run the Gradio or command-line workflow with your presenter image and `output.wav`.

## 3. Finalize with FFmpeg

After SadTalker creates the presenter video, convert it to the desired Clipora canvas. Example for 9:16:

```bash
ffmpeg -i result.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -r 30 -c:v libx264 -c:a aac -movflags +faststart clipora-presenter.mp4
```

## 4. Import into Clipora

Open Clipora → Media → Import media and select `clipora-presenter.mp4`.

## Notes

- Free Colab GPU availability is not guaranteed.
- Hugging Face model access may require accepting the model's current conditions.
- Only use presenter images and voice references you have permission to process.
- If Colab disconnects, save intermediate WAV/MP4 files before starting another run.
