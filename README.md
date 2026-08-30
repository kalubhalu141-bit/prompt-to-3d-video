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

- **Three.js** (109k★, MIT) — the core WebGL engine (CDN load)
- **pmndrs/postprocessing** (2.8k★, Zlib) — EffectComposer-style pass chain
  (bloom → LUT → grain → letterbox)
- **AnimateDiff** (Apache-2.0) — temporal coherence via eased motion
- **Wan 2.2** (Alibaba, Apache-2.0) — cinematic-aesthetic data with
  lighting / composition / contrast / color-tone labels
- **LTX-Video** (Lightricks, Apache-2.0) — fast-iteration framing
- **Open-Sora** (HPCAI, Apache-2.0) — open video production
- **WebGPU-Video-Diffusion** (Text-to-Video Zero) — 8-frame keyframe path
  (in-browser mock; real ONNX inference needs the ~4 GB model)
- **HunyuanVideo** (Tencent, custom community license — cited only) — 13B
  T2V model; not bundled, see `THIRD_PARTY.md` for license terms
- **PANDORA** (GPL v3 — inspiration only) — the screenplay → storyboard →
  shot-list pre-prod flow (clean-room re-implementation, no GPL code)
- **Deforum** — eased camera moves (orbit / crane / reveal / push-orbit)
- **Lottie** (Airbnb, MIT) — kinetic-title 2D engine inspiration
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

## 🎞 Hooking a real local T2V model

The 🎥 3D Video tab ships with **procedural Three.js / 2D scenes** that
synthesise motion from a prompt. If you have the GPU and want **real
generative video**, you can run any of the open-source T2V models locally
and pipe its output into this app's MediaRecorder / ffmpeg export stage.

| Model | Stars | License | VRAM | Best for |
|---|---|---|---|---|
| **Pixelle-Video** | 27k | Apache-2.0 | varies | Fully-automated short-video engine |
| **VideoLingo** | 18k | Apache-2.0 | 8 GB | Netflix-level subtitle cutting + translation |
| **FramePack** | 17k | Apache-2.0 | 6 GB | Practical video diffusion, next-frame packing |
| **CogVideo / CogVideoX** | 13k | Apache-2.0 | 12–24 GB | T2V/I2V from Zhipu AI |
| **video-subtitle-remover** | 12.6k | Apache-2.0 | 4–8 GB | Inpaint hard subtitles out of any video |
| **LTX-Video** | 11k | Apache-2.0 | 12–24 GB | Real-time fast iteration on 4090 |
| **video-subtitle-extractor** | 9.4k | Apache-2.0 | 4 GB | Hard-subtitle → SRT |
| **Hallo** (Fudan) | 8.7k | MIT | 12 GB | Audio-driven portrait animation |
| **InfiniteTalk** | 7.7k | Apache-2.0 | 24 GB | Unlimited-length talking video |
| **video-retalking** | 7.3k | Apache-2.0 | 8 GB | Lip-sync to new audio |
| **video-shotcraft** | 6.7k | Apache-2.0 | varies | AI video skill for coding agents |
| **Open-Sora** (11B) | 29k | Apache-2.0 | 24+ GB | Highest-quality open T2V |
| **Wan 2.2** (5B) | 3.5k | Apache-2.0 | 24 GB (4090) | Cinematic T2V/I2V @ 720p 24fps |
| **TurboDiffusion** | 3.6k | Apache-2.0 | 24+ GB | 100–200× faster video diffusion |
| **Stable Video Infinity** | 2.6k | Apache-2.0 | 24+ GB | Infinite-length T2V (ICLR 2026) |
| **HunyuanVideo** (13B) | 4.5k | Tencent Community | 24+ GB | Tencent's flagship (territory restrictions) |
| **AnimateDiff** | 12k | Apache-2.0 | 12 GB | Animate any SD-1.5 checkpoint |
| **Champ** | 4.3k | MIT | 12 GB | Controllable human image animation |
| **First Order Model** | 15k | MIT | 4–8 GB | Image animation via motion transfer |
| **StableAnimator** | 1.4k | MIT | 12+ GB | Pose-driven human animation |
| **html-video** (nexu-io) | 4.5k | Apache-2.0 | 0 | HTML → video for coding agents |

All are listed in `THIRD_PARTY.md` with full license terms and the exact
"Wan 2.2 → render to `out/clips/scene1.mp4` → ffmpeg into `out/film.mp4`"
recipe. To integrate one with this app, run its inference CLI and then
either:

- Drop the resulting MP4 into a `clips/` folder, and use the existing
  🎥 3D Video tab's MediaRecorder path to add LUTs / grain / letterbox.
- Or open the file in any video editor and use the 🎬 Cinema Studio's
  per-shot FLUX keyframes as a storyboard reference.
- For **subtitles**: VideoLingo / video-subtitle-remover / video-subtitle-extractor
  give you Netflix-quality cut + translate + extract / remove pipelines that
  pair perfectly with the in-browser render.

The local models listed above are **not bundled** in this repo — they're
multi-GB and would break the keyless-instant-install promise. They're
cited so you know which models inspired the design and how to swap one in.

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

This project is a **clean-room merger** of the strongest free, permissively-licensed
open-source video / film / VFX projects on GitHub. Every one is cited with its
license in [`THIRD_PARTY.md`](THIRD_PARTY.md). Categories:

**Foundation models (T2V / I2V)** — Apache-2.0 unless noted
- [AnimateDiff](https://github.com/guoyww/AnimateDiff) · [Wan 2.2](https://github.com/Wan-Video/Wan2.2) · [LTX-Video](https://github.com/Lightricks/LTX-Video) · [Open-Sora](https://github.com/hpcaitech/Open-Sora) · [CogVideo](https://github.com/zai-org/CogVideo) · [FramePack](https://github.com/lllyasviel/FramePack) · [TurboDiffusion](https://github.com/thu-ml/TurboDiffusion) · [Pixelle-Video](https://github.com/ATH-MaaS/Pixelle-Video)
- [HunyuanVideo](https://github.com/Tencent-Hunyuan/HunyuanVideo) — Tencent Community License (cited only, NOT bundled)
- [Stable Video Infinity](https://github.com/vita-epfl/Stable-Video-Infinity) · [Paper2Video](https://github.com/showlab/Paper2Video) · [Code2Video](https://github.com/showlab/Code2Video) · [MotionDirector](https://github.com/showlab/MotionDirector)
- [Hallo](https://github.com/fudan-generative-vision/hallo) · [Champ](https://github.com/fudan-generative-vision/champ) · [First Order Model](https://github.com/AliaksandrSiarohin/first-order-model) · [StableAnimator](https://github.com/Francis-Rings/StableAnimator) · [Make-A-Video](https://github.com/lucidrains/make-a-video-pytorch) · [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) · [WebGPU-Video-Diffusion](https://github.com/WebGPU-Video-Diffusion/WebGPU-Video-Diffusion)

**VFX / post-processing / motion graphics** — MIT/Apache-2.0
- [Three.js](https://github.com/mrdoob/three.js) · [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) · [Lottie](https://github.com/airbnb/lottie-web) · [mo.js](https://github.com/mojs/mojs) · [Seriously.js](https://github.com/brianchirls/Seriously.js) · [vfx-js](https://github.com/fand/vfx-js) · [Filament](https://github.com/google/filament) · [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) · [Tixl](https://github.com/tixl3d/tixl) · [Motionity](https://github.com/alyssaxuu/motionity) · [Astrofox](https://github.com/astrofox-io/astrofox) · [Pixel Composer](https://github.com/Ttanasart-pt/Pixel-Composer) · [nexrender](https://github.com/inlife/nexrender) · [Vue-Lottie](https://github.com/chenqingspring/vue-lottie)

**Video editors (in-browser, MIT)** — closest competitors
- [OpenReel Video](https://github.com/Augani/openreel-video) · [Clypra](https://github.com/AIEraDev/Clypra) · [FreeCut](https://github.com/walterlow/freecut) · [mebm](https://github.com/bwasti/mebm) · [Clip-JS](https://github.com/mohyware/clip-js) · [FableCut](https://github.com/ronak-create/FableCut) · [ai-video-editor](https://github.com/MartinDelophy/ai-video-editor) · [CartCut](https://github.com/cartesiancs/cartcut) · [fabric-video-editor](https://github.com/AmitDigga/fabric-video-editor)

**Image ↔ Video merge / talking-head / subtitles** — Apache-2.0/MIT
- [InfiniteTalk](https://github.com/MeiGen-AI/InfiniteTalk) · [video-retalking](https://github.com/OpenTalker/video-retalking) · [VideoLingo](https://github.com/Huanshere/VideoLingo) · [video-subtitle-remover](https://github.com/YaoFANGUK/video-subtitle-remover) · [video-subtitle-extractor](https://github.com/YaoFANGUK/video-subtitle-extractor) · [html-video](https://github.com/nexu-io/html-video) · [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) · [VideoPipe](https://github.com/sherlockchou86/VideoPipe) · [react-native-video-processing](https://github.com/shahen94/react-native-video-processing) · [Polyvia](https://github.com/Ovilia/Polyvia) · [DPlayer](https://github.com/DIYgod/DPlayer) · [JiaoZiVideoPlayer](https://github.com/lipangit/JiaoZiVideoPlayer) · [videojs-player](https://github.com/surmon-china/videojs-player) · [Cabbage](https://github.com/VideoFlint/Cabbage) · [FFdynamic](https://github.com/Xingtao/FFdynamic)

**Cinema pre-production / camera moves** — inspiration only
- [PANDORA](https://github.com/22eme-Arkane/PANDORA) — GPL v3 (inspiration only)
- [Deforum](https://github.com/deforum-art/sd-webui-deforum) — Other license (inspiration only)

**The user's own repos** (the actual base code, MIT, kalubhalu141-bit)
- [stellarforge](https://github.com/kalubhalu141-bit/stellarforge) · [commercial-video-studio](https://github.com/kalubhalu141-bit/commercial-video-studio) · [cinematic-dating-video](https://github.com/kalubhalu141-bit/cinematic-dating-video) · [blender-ai-studio](https://github.com/kalubhalu141-bit/blender-ai-studio) · [seedance-studio](https://github.com/kalubhalu141-bit/seedance-studio) (local)

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
