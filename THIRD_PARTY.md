# Third-party credits

This project merges patterns and code from many open-source projects. Every
contribution is cited below with **its source, its license, and what was used**.

If a license is missing or wrong, please open an issue.

---

## Code merged into this repository

| Project | Source | License | What we used |
|---|---|---|---|
| **Infinity Video Generator (local)** | `D:\video-generator\` (user's own work) | MIT (own) | Base single-page studio — 1651-line `index.html`, 48-engine `server.js`, `server-engines.js`, `server-power.js`, `verify.js`, MP4/WebM muxers, Vercel config |
| **seedance-studio (local)** | `D:\seedance-studio\` (user's own work) | MIT (own) | Inspiration for the 3D Video scene registry + director pattern |
| **stellarforge (GitHub)** | [kalubhalu141-bit/stellarforge](https://github.com/kalubhalu141-bit/stellarforge) | MIT (own) | Inspiration for the cinema screenplay → storyboard → shot-list flow and director notes UI |
| **commercial-video-studio (GitHub)** | [kalubhalu141-bit/commercial-video-studio](https://github.com/kalubhalu141-bit/commercial-video-studio) | MIT (own) | Inspiration for engine catalog structure |
| **cinematic-dating-video (GitHub)** | [kalubhalu141-bit/cinematic-dating-video](https://github.com/kalubhalu141-bit/cinematic-dating-video) | MIT (own) | Inspiration for Ken Burns photo-to-video pattern (already implemented in base Studio tab) |
| **blender-ai-studio (GitHub)** | [kalubhalu141-bit/blender-ai-studio](https://github.com/kalubhalu141-bit/blender-ai-studio) | MIT (own) | Inspiration for the modular engine registry |
| **Three.js** | [mrdoob/three.js](https://github.com/mrdoob/three.js) | MIT | Core 3D engine (CDN-loaded). 109k★ — the foundation of all in-browser WebGL. |
| **pmndrs/postprocessing** | [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) | Zlib (≈MIT permissive) | EffectComposer / bloom / vignette / chromatic-aberration patterns. Inspired the fx-canvas composite stack. **No code copied.** |

---

## Inspirations — video editors (browser-based, free)

These are fully open-source video editors. They're large apps (not bundled),
but their patterns and code shape this project's approach to a 100% in-browser
edit → render pipeline.

| Project | Source | License | Stars | What we drew from |
|---|---|---|---|---|
| **OpenReel Video** | [Augani/openreel-video](https://github.com/Augani/openreel-video) | MIT | 4.9k | Professional browser-based video editor. Timeline / multi-track / preview. Inspired the Cinema Studio scene timeline idea. |
| **Clypra** | [AIEraDev/Clypra](https://github.com/AIEraDev/Clypra) | MIT | 3.2k | Modern Tauri + React + TypeScript video editor. Cited for desktop-app future. |
| **FreeCut** | [walterlow/freecut](https://github.com/walterlow/freecut) | MIT | 2.1k | Professional-grade browser video editor. 100% in-browser. Cited as the closest free competitor. |
| **mebm** | [bwasti/mebm](https://github.com/bwasti/mebm) | MIT | 1k | Zero-dependency browser-based video editor. **No code copied** — cited for the "zero-dep browser editor" philosophy. |
| **Clip-JS** | [mohyware/clip-js](https://github.com/mohyware/clip-js) | MIT | 768 | Next.js + Remotion + ffmpeg.wasm. Cited for the WASM ffmpeg path. |
| **FableCut** | [ronak-create/FableCut](https://github.com/ronak-create/FableCut) | MIT | 642 | Zero-dep browser editor that **AI agents can drive** via JSON tasks. Cited for the AI-driven edit idea. |
| **ai-video-editor** | [MartinDelophy/ai-video-editor](https://github.com/MartinDelophy/ai-video-editor) | MIT | 638 | Local-first video editor where creators AND AI agents edit together. Closest philosophy to this project. |
| **CartCut** | [cartesiancs/cartcut](https://github.com/cartesiancs/cartcut) | MIT | 590 | Video editor for AI agents, "open source can be beautiful" stance. |
| **fabric-video-editor** | [AmitDigga/fabric-video-editor](https://github.com/AmitDigga/fabric-video-editor) | MIT | 574 | Next.js + React + Tailwind + MobX. |

---

## Inspirations — video generation foundation models (T2V/I2V)

These are too large to bundle (multi-GB weights, Python training code) — we
cite them so you can run them locally and **pipe their output into this app's
MediaRecorder / ffmpeg export stage** for real generative video.

| Project | Source | License | Stars | What we drew from |
|---|---|---|---|---|
| **AnimateDiff** | [guoyww/AnimateDiff](https://github.com/guoyww/AnimateDiff) | Apache-2.0 | 12k | Temporal coherence via eased motion, motion module concept. **No code copied.** |
| **Wan 2.2** (Alibaba) | [Wan-Video/Wan2.2](https://github.com/Wan-Video/Wan2.2) | Apache-2.0 | 3.5k | 5B MoE T2V/I2V at 720p@24fps. Cinematic aesthetic data with lighting/composition/contrast labels — directly inspired our LUT pipeline and director style notes. |
| **LTX-Video** (Lightricks) | [Lightricks/LTX-Video](https://github.com/Lightricks/LTX-Video) | Apache-2.0 | 11k | 10B asymmetric diffusion transformer, 128× video VAE compression, 30fps faster-than-real-time on 4090. |
| **Open-Sora** (HPCAI) | [hpcaitech/Open-Sora](https://github.com/hpcaitech/Open-Sora) | Apache-2.0 | 29k | "Democratizing efficient video production". The 11B version benchmarks near HunyuanVideo. |
| **HunyuanVideo** (Tencent) | [Tencent-Hunyuan/HunyuanVideo](https://github.com/Tencent-Hunyuan/HunyuanVideo) | **Tencent Hunyuan Community License** (custom, restrictive — see § Tencent) | 4.5k | 13B T2V. **NOT bundled, NOT imported, NOT weight-shared.** Cited for completeness. |
| **CogVideo / CogVideoX** (Zhipu) | [zai-org/CogVideo](https://github.com/zai-org/CogVideo) | Apache-2.0 | 13k | Text and image to video, CogVideoX (2024) + CogVideoX-2.  |
| **FramePack** | [lllyasviel/FramePack](https://github.com/lllyasviel/FramePack) | Apache-2.0 | 17k | "Lets make video diffusion practical!" — next-frame context packing. 6GB VRAM. |
| **TurboDiffusion** | [thu-ml/TurboDiffusion](https://github.com/thu-ml/TurboDiffusion) | Apache-2.0 | 3.6k | 100–200× acceleration for video diffusion models. |
| **Stable Video Infinity** (EPFL) | [vita-epfl/Stable-Video-Infinity](https://github.com/vita-epfl/Stable-Video-Infinity) | Apache-2.0 | 2.6k | ICLR 2026 Oral — infinite-length video generation. |
| **Paper2Video** (ShowLab) | [showlab/Paper2Video](https://github.com/showlab/Paper2Video) | Apache-2.0 | 2.4k | Automatic video generation from scientific papers. |
| **Code2Video** (ShowLab) | [showlab/Code2Video](https://github.com/showlab/Code2Video) | Apache-2.0 | 2k | ICML 2026 — video generation via code. |
| **MotionDirector** (ShowLab) | [showlab/MotionDirector](https://github.com/showlab/MotionDirector) | Apache-2.0 | 1k | ECCV 2024 Oral — motion customization of T2V. |
| **First Order Model** | [AliaksandrSiarohin/first-order-model](https://github.com/AliaksandrSiarohin/first-order-model) | MIT | 15k | Image animation via motion transfer (the original FOM). |
| **Hallo** (Fudan) | [fudan-generative-vision/hallo](https://github.com/fudan-generative-vision/hallo) | MIT | 8.7k | Hierarchical audio-driven portrait image animation. |
| **Champ** (Fudan) | [fudan-generative-vision/champ](https://github.com/fudan-generative-vision/champ) | MIT | 4.3k | ECCV 2024 — controllable and consistent human image animation. |
| **Make-A-Video** (Meta, unofficial) | [lucidrains/make-a-video-pytorch](https://github.com/lucidrains/make-a-video-pytorch) | MIT | 2k | Unofficial PyTorch re-implementation of Meta's Make-A-Video. |
| **Pixelle-Video** | [ATH-MaaS/Pixelle-Video](https://github.com/ATH-MaaS/Pixelle-Video) | Apache-2.0 | 27k | AI fully-automated short-video engine. |
| **StableAnimator** | [Francis-Rings/StableAnimator](https://github.com/Francis-Rings/StableAnimator) | MIT | 1.4k | CVPR2025 — end-to-end ID-preserving human animation. |
| **Open-Generative-AI** | [Anil-matcha/Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) | MIT | — | 400+ model aggregator. Inspired the engine-catalog concept. |
| **WebGPU-Video-Diffusion (WebT2V)** | [WebGPU-Video-Diffusion/WebGPU-Video-Diffusion](https://github.com/WebGPU-Video-Diffusion/WebGPU-Video-Diffusion) | academic (no LICENSE) | — | Penn CIS 5650 — Text-to-Video Zero in WebGPU. Inspired the 8-frame keyframe mock. |

---

## Inspirations — VFX / post-processing / motion graphics

| Project | Source | License | Stars | What we drew from |
|---|---|---|---|---|
| **Lottie / lottie-web** (Airbnb) | [airbnb/lottie-web](https://github.com/airbnb/lottie-web) | MIT | 32k | After Effects → web animations. Inspired the kinetic-title 2D engine. |
| **mo.js** | [mojs/mojs](https://github.com/mojs/mojs) | MIT | 19k | The motion graphics toolbelt for the web. Cited for declarative motion. |
| **Tixl** | [tixl3d/tixl](https://github.com/tixl3d/tixl) | — | 5k | Open-source realtime motion graphics. Cited for node-based VFX. |
| **Motionity** | [alyssaxuu/motionity](https://github.com/alyssaxuu/motionity) | — | 4k | Web-based motion graphics editor. |
| **Astrofox** | [astrofox-io/astrofox](https://github.com/astrofox-io/astrofox) | — | 2k | Turn audio into motion graphics. Cited for the music-driven VFX idea. |
| **Seriously.js** | [brianchirls/Seriously.js](https://github.com/brianchirls/Seriously.js) | MIT | 3.9k | Real-time, node-based **video effects compositor for the web** built on WebGL. Closest philosophy to our composite stack. |
| **vfx-js** | [fand/vfx-js](https://github.com/fand/vfx-js) | MIT | 1.1k | WebGL effects made easy. |
| **Pixel Composer** | [Ttanasart-pt/Pixel-Composer](https://github.com/Ttanasart-pt/Pixel-Composer) | — | 1.4k | Node-based VFX editor for pixel art. |
| **nexrender** | [inlife/nexrender](https://github.com/inlife/nexrender) | — | 1.9k | Data-driven render automation for After Effects. |
| **Vue-Lottie** | [chenqingspring/vue-lottie](https://github.com/chenqingspring/vue-lottie) | — | 1.3k | Lottie for Vue. |
| **Filament** (Google) | [google/filament](https://github.com/google/filament) | Apache-2.0 | — | Real-time PBR engine. Inspired the logo-reveal PBR look. |
| **three-mesh-bvh** | [gkjohnson/three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) | MIT | 3.3k | Accelerated raycasting. Cited for future use in scene picking. |

---

## Inspirations — film generation, talking-head, image-to-video, image-video merge

| Project | Source | License | Stars | What we drew from |
|---|---|---|---|---|
| **InfiniteTalk** | [MeiGen-AI/InfiniteTalk](https://github.com/MeiGen-AI/InfiniteTalk) | Apache-2.0 | 7.7k | Unlimited-length talking-video generation (audio-driven avatar). |
| **video-retalking** (SIGGRAPH Asia 2022) | [OpenTalker/video-retalking](https://github.com/OpenTalker/video-retalking) | Apache-2.0 | 7.3k | Audio-based lip-sync for any talking-head video. |
| **VideoLingo** | [Huanshere/VideoLingo](https://github.com/Huanshere/VideoLingo) | Apache-2.0 | 18k | "Netflix-level subtitle cutting, translation, alignment, and generation" — cited for the multi-language subtitle pipeline. |
| **video-subtitle-remover** | [YaoFANGUK/video-subtitle-remover](https://github.com/YaoFANGUK/video-subtitle-remover) | Apache-2.0 | 12.6k | AI image/video hard-subtitle removal (inpainting). |
| **video-subtitle-extractor** | [YaoFANGUK/video-subtitle-extractor](https://github.com/YaoFANGUK/video-subtitle-extractor) | Apache-2.0 | 9.4k | Hard-subtitle extraction → SRT. |
| **html-video** (nexu-io) | [nexu-io/html-video](https://github.com/nexu-io/html-video) | Apache-2.0 | 4.5k | Programmatic video for coding agents — HTML → video. Same AI-driven philosophy as this project. |
| **video-shotcraft** | [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | Apache-2.0 | 6.7k | AI video skill for Claude Code & Codex — cinematic product videos. |
| **VideoPipe** | [sherlockchou86/VideoPipe](https://github.com/sherlockchou86/VideoPipe) | Apache-2.0 | 2.9k | Cross-platform video structuring framework. |
| **react-native-video-processing** | [shahen94/react-native-video-processing](https://github.com/shahen94/react-native-video-processing) | MIT | 1.3k | Native video editing/trimming/compressing library. |
| **Polyvia** | [Ovilia/Polyvia](https://github.com/Ovilia/Polyvia) | MIT | 1.2k | Low-poly image and video processing. |
| **DPlayer** | [DIYgod/DPlayer](https://github.com/DIYgod/DPlayer) | MIT | 16k | HTML5 danmaku video player. |
| **JiaoZiVideoPlayer** | [lipangit/JiaoZiVideoPlayer](https://github.com/lipangit/JiaoZiVideoPlayer) | — | 10k | MediaPlayer / exoplayer / ijkplayer / ffmpeg for Android. |
| **videojs-player** | [surmon-china/videojs-player](https://github.com/surmon-china/videojs-player) | — | 5.4k | video.js Vue/React component. |
| **Cabbage** | [VideoFlint/Cabbage](https://github.com/VideoFlint/Cabbage) | — | 1.6k | Video composition framework on AVFoundation (iOS). |
| **FFdynamic** | [Xingtao/FFdynamic](https://github.com/Xingtao/FFdynamic) | — | 373 | Library with dynamic audio/video composition and runtime control. |

---

## Inspirations — cinema pre-production / camera moves

| Project | Source | License | Stars | What we drew from |
|---|---|---|---|---|
| **PANDORA** (22eme Arkane) | [22eme-Arkane/PANDORA](https://github.com/22eme-Arkane/PANDORA) | **GPL v3** (NOT compatible — inspiration only) | — | Cinema pre-production workflow: screenplay → storyboard → shot list → per-shot generation. **No code copied — clean-room re-implementation.** |
| **Deforum** (Stable Diffusion) | [deforum-art/sd-webui-deforum](https://github.com/deforum-art/sd-webui-deforum) | Other (no permissive license) | 2.8k | 2D/3D camera-verb easing, prompt interpolation. Inspired the camera-move math (`easeInOutCubic`). **No code copied.** |
| **Film Forever / cine** | various (cited in academic papers, not single repo) | n/a | n/a | Six-beat screenplay structure (Setup / Inciting Incident / Rising / Midpoint / Climax / Resolution) is the standard Hollywood structure used in Cinema Studio. |

---

## External services (called by this app, not merged)

| Service | Used for | Auth |
|---|---|---|
| [Pollinations.ai](https://pollinations.ai) | Image generation (FLUX) | none |
| [Pexels](https://pexels.com) | Stock photos | none |
| [Pixabay](https://pixabay.com) | Stock photos | none |
| [Picsum](https://picsum.photos) | Random photos | none |
| [MyMemory](https://mymemory.translated.net) | Translation | none (rate-limited) |
| [Wikipedia REST](https://en.wikipedia.org/api/rest_v1/) | Topic research | none |
| [Hacker News](https://hn.algolia.com/api) | Trends | none |
| [GitHub REST](https://api.github.com) | Repo search / trends | optional (raises rate limit) |
| [Ollama](http://localhost:11434) | Local LLM (optional) | none (local) |
| **Three.js** (CDN) | WebGL engine | MIT |
| **transformers.js** (CDN, optional) | On-device AI | Apache-2.0 |

---

## 🔒 Tencent Hunyuan Community License (read this if you redistribute)

HunyuanVideo is **NOT** MIT or Apache. The full terms are in
[HunyuanVideo/LICENSE.txt](https://github.com/Tencent-Hunyuan/HunyuanVideo/blob/main/LICENSE.txt),
but the key restrictions are:

- **Section 5(b)** — must NOT use Hunyuan outputs/results to improve any
  other AI model (other than Hunyuan or its Model Derivatives).
- **Section 5(c)** — Territory restriction: cannot be used in the
  **European Union, United Kingdom, or South Korea**.
- **Section 3(d)** — any non-hosted-service distribution must include
  a "Notice" text file with Tencent's copyright line.
- **Section 4** — products with **>100M MAU** need a separate commercial
  license from Tencent.

**This project does not bundle, import, or weight-share with HunyuanVideo.**
It is cited here only for completeness as one of the most prominent
open-weights T2V models. If you fork this repo and choose to call
HunyuanVideo from the local-Ollama path or your own inference server, you
are responsible for complying with Tencent's terms.

---

## Licenses — quick reference

- **MIT** — permissive, allows merge with attribution
- **Apache-2.0** — permissive, requires NOTICE file (we comply via this file)
- **Zlib** — permissive, ≈MIT (used by pmndrs/postprocessing)
- **GPL v3** — copyleft, **NOT compatible** with MIT — inspiration only
- **Tencent Hunyuan Community License** — custom, restrictive, NOT MIT-compatible
- **Other / academic** — check before use; inspiration only

---

## How to comply

If you fork or redistribute this repository:

1. **Keep** the `LICENSE` (MIT) and `THIRD_PARTY.md` (this file) intact.
2. **Keep** all `LICENSE` files in any third-party code you add.
3. **Do NOT** import GPL-licensed or Hunyuan-licensed code into this
   codebase — both would force the whole project to their license.
4. The Apache-2.0 NOTICE requirement is satisfied by this THIRD_PARTY.md.
5. WebGPU-Video-Diffusion has no LICENSE file; treat as "academic use",
   patterns only.
6. If you add HunyuanVideo inference: bundle Tencent's LICENSE.txt and the
   required NOTICE file in your distribution.

---

## Issues / corrections

If a license is wrong or a credit is missing, please open a GitHub issue
on the repo.
