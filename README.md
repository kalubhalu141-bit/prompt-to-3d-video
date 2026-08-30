# 🎥 prompt-to-3d-video

> **One prompt. 9 scene engines. Real MP4 / WebM output. Zero API keys.**
> A merged, keyless, browser-first video studio with a 3D WebGL path and a cinema pre-production pipeline.

```
prompt → 🎥 3D Video Studio  (Three.js + WebGL → MediaRecorder → MP4)
       → 🎬 Cinema Studio    (screenplay → storyboard → per-shot images)
       → 🎬 Studio           (full 56-engine workbench, TTS, voice, publish)
       → 🐙 GitHub Hub       (live repo search / trends / gists)
       → 📡 On-Device AI     (transformers.js, TFJS, task picker)
       → 🔥 Trends, 🌐 Translate, 🗣 TTS, ⚒️ Thumbnail Forge, 🔬 Research
```

This repo is a **clean-room merger** of multiple open-source video projects (see
[`THIRD_PARTY.md`](THIRD_PARTY.md) for every inspiration + license). The output is
one MIT-licensed single-page app that you can `npm start` and use immediately.

## ✨ What it does

| Section | Real engines / behaviour |
|---|---|
| 🎥 **3D Video Studio** | 9 procedural scenes: galaxy (8k particles + bloom), planet (rings + lighting), neon city (low-poly + fog), fire burst, ocean waves (displacement), warp tunnel, kinetic title, logo reveal, WebGPU T2V-Zero. 7 film LUTs, 5 camera moves, 5 lens FOVs, letterbox 2.35:1, film grain. **Real `MediaRecorder` export to WebM/MP4.** |
| 🎬 **Cinema Studio** | Rule-based screenplay generator (6-beat arc) + scene breakdown + per-shot Pollinations FLUX keyframes. 6 director styles (Kubrick, Nolan, Vintage 70s, Anime, Nature doc, Cyberpunk). |
| 🎬 **Studio** | 56 AI engines — idea → plan → shot board (Pollinations) → voiceover (TTS) → publish pack → render to WebM/MP4. |
| 🧠 **Workbench** | 56 deterministic engine scripts (hook writer, script writer, color grader, shot list, story ideas…). |
| 🎨 **Image Studio** | Pollinations FLUX text-to-image with 9 style presets. |
| 📚 **Stock Library** | Pexels + Pixabay keyless stock + Picsum + Lorem Picsum. |
| ⚡ **AI Copilot** | Free local Ollama LLM (or rule-based fallback) chat for prompts. |
| 📡 **On-Device AI** | transformers.js + TFJS task picker (zero keys, runs in browser). |
| 🐙 **GitHub Hub** | Live repo search, trending, gist save. |
| 🔥 **Trends** | GitHub trending + Hacker News + YouTube trending. |
| 🌐 **Translate** | 100+ languages via free MyMemory API. |
| 🗣 **TTS Voiceover** | 14 languages, free web-TTS. |
| ⚒️ **Thumbnail Forge** | 4-up thumbnail generator with text overlays. |
| 🔬 **Topic Research** | Wikipedia + RSS news → video angles. |
| ∞ **Infinite Features** | Every tab gets an infinite-ideas feed (∞ Load more). |

**The 3D Video engine** is the focus of this repo: it produces a real downloadable
video file from a single text prompt, runs entirely in the browser, and uses
**zero API keys**. The pipeline is:

```
[Three.js / Canvas]  →  [fx canvas: bloom + LUT + grain + letterbox]
                    →  [MediaRecorder.captureStream()]
                    →  [Blob → <a download="...mp4">]
```

## 🚀 Run it

```bash
# Node 18+ recommended
cd D:\prompt-to-3d-video
node server.js
# → http://localhost:3000

# Or with Vercel (no build)
vercel deploy --prod
```

## 🛠 Architecture

```
D:\prompt-to-3d-video\
├── server.js              zero-dep http server, 48 API routes
├── server-engines.js      48 deterministic engine scripts
├── server-power.js        14 power engines (viral, retention, ads, …)
├── public/
│   └── index.html         single-page studio (1651 → 2353 lines)
├── api/
│   └── index.js           Vercel serverless entry
├── mp4-muxer.mjs          MP4 muxing client-side
├── webm-muxer.mjs         WebM muxing client-side
├── verify.js              end-to-end smoke test
├── vercel.json            no-build static deploy
├── THIRD_PARTY.md         every merged repo + license
├── LICENSE                MIT
└── README.md              this file
```

## 🎥 The 3D Video pipeline (deep dive)

The **🎥 3D Video** tab is the heart of this merger. It combines patterns from:

- **AnimateDiff / Stable Video Diffusion** — temporal coherence via eased motion
- **WebGPU-Video-Diffusion** (Text-to-Video Zero) — 8-frame keyframe path
  (in-browser mock; real ONNX inference needs the ~4 GB model)
- **PANDORA** — the screenplay → storyboard → shot-list pre-prod flow
  (clean-room re-implementation, no GPL code)
- **Deforum** — eased camera moves (orbit / crane / reveal / push-orbit)
- **Seedance Studio / Infinity Video Generator** — scene registry,
  MediaRecorder export, LUT pipeline

### Scene registry (clean-room)

Every scene builder returns `{ scene, camera, update(p, el) }` (3D) or
`{ engine: '2d', canvas, update(p, el) }` (2D). The render loop is
**scene-agnostic** — same `tick(p, el)` drives every engine:

```js
const SCENES = { galaxy, planet, city, fire, waves, tunnel, title, logo, webgpu, fallback };
// 3D path:    scene → renderer.render() → fx composite → MediaRecorder
// 2D path:    canvas → fx composite     → MediaRecorder
```

### Composite stack (baked into every frame)

1. Source → fx canvas (`drawImage`)
2. **Bloom** — downscale to W/2, `filter=blur(6px) brightness(1.5)`, screen-blend
3. **LUT** — per-pixel 3×3 colour matrix (downscale to 160 px for speed)
4. **Grain** — 800 random 1×1 dots at α 0.06
5. **Letterbox 2.35:1** — black bars

### MediaRecorder capture-timing pitfall (fixed)

A naive `rec.start()` after `captureStream` produces a **0-byte file** because
the canvas hasn't been drawn into yet. We prime with one synchronous `tick(0, 0)`
**before** `captureStream`, then `rec.start()`. This is documented in
`browser-video-generator` skill's PITFALL section.

### Camera move easing

```js
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;  // easeInOutCubic
const easeOut = t => 1 - Math.pow(1 - t, 3);
```

Linear `p * 2π` is too robotic — every camera move uses `ease(p)`.

## 🆓 What you get without ANY API key

| Feature | Source | Needs key? |
|---|---|---|
| 3D scene render | local Three.js | ❌ |
| Video export | local MediaRecorder | ❌ |
| Image generation (shot board) | [Pollinations.ai](https://pollinations.ai) | ❌ |
| Stock photos | Pexels, Pixabay, Picsum | ❌ |
| TTS voiceover | browser Web Speech API | ❌ |
| Translation | MyMemory free API | ❌ |
| GitHub search | public REST | ❌ |
| On-device AI | transformers.js | ❌ |
| LLM chat (Copilot) | local Ollama (or rules) | ❌ |
| Cinema screenplay | rule-based beats | ❌ |

## 🧠 LLM upgrade path (optional)

The Cinema Studio uses a 6-beat rule-based screenplay. To upgrade to a real LLM
director, point the Copilot at a local Ollama instance:

```bash
# In one terminal
ollama pull hermes3
ollama serve

# In another
node server.js
# → click ⚡ AI Copilot → model = hermes3
```

You can wire any of the Cinema Studio buttons to call Ollama via
`POST /api/generate`. The rule-based version is the offline default.

## 🎬 Cinema pre-prod flow

```
Logline  →  Screenplay (6 beats)  →  Storyboard (6 scenes)  →  Shot list (Pollinations)
```

Every scene in the storyboard has:
- Name + 1-line description
- Camera move (per director style)
- Grade (per director style)
- Full prompt: `logline + beat name + description + style suffix`

The 3D Video tab can re-render any shot as a 3D animated scene by pasting the
prompt into the Prompt field.

## 📜 License

MIT. See [`LICENSE`](LICENSE) and [`THIRD_PARTY.md`](THIRD_PARTY.md).

## 🙏 Credits

The merged open-source inspirations (every one cited with license in `THIRD_PARTY.md`):
[AnimateDiff](https://github.com/guoyww/AnimateDiff) · [StableAnimator](https://github.com/Francis-Rings/StableAnimator) · [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) · [WebGPU-Video-Diffusion](https://github.com/WebGPU-Video-Diffusion/WebGPU-Video-Diffusion) · [PANDORA](https://github.com/22eme-Arkane/PANDORA) · [Deforum](https://github.com/deforum-art/sd-webui-deforum)

The user's own repos (the actual base code, MIT, kalubhalu141-bit):
[stellarforge](https://github.com/kalubhalu141-bit/stellarforge) · [commercial-video-studio](https://github.com/kalubhalu141-bit/commercial-video-studio) · [cinematic-dating-video](https://github.com/kalubhalu141-bit/cinematic-dating-video) · [blender-ai-studio](https://github.com/kalubhalu141-bit/blender-ai-studio) · [seedance-studio](https://github.com/kalubhalu141-bit/seedance-studio) (local)

## ⚠️ What's NOT a fake

Every engine either runs locally in your browser or hits a keyless public API.
There is no "AI" toggle that just plays a CSS animation. If an engine doesn't
work in your environment, the UI tells you and falls back gracefully.

## ⚠️ What's intentionally limited

- **WebGPU T2V-Zero** is a clean-room 8-frame mock — the real model is 4 GB and
  not bundled. The mock demonstrates the exact integration shape you'd swap in.
- No watermark, no subscription, no upload, no telemetry.
- No claims of being a Sora/Runway replacement — it's a keyless local studio
  built from the best free open-source patterns, on the user's own machine.
