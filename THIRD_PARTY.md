# Third-party credits

This project merges patterns and code from many open-source projects. Every
contribution is cited below with **its source, its license, and what was used**.

If a license is missing or wrong, please open an issue.

## Code merged into this repository

| Project | Source | License | What we used |
|---|---|---|---|
| **Infinity Video Generator (local)** | `D:\video-generator\` (user's own work) | MIT (own) | Base single-page studio — 1651-line `index.html`, 48-engine `server.js`, `server-engines.js`, `server-power.js`, `verify.js`, MP4/WebM muxers, Vercel config |
| **seedance-studio (local)** | `D:\seedance-studio\` (user's own work) | MIT (own) | Inspiration for the 3D Video scene registry + director pattern |
| **stellarforge (GitHub)** | [kalubhalu141-bit/stellarforge](https://github.com/kalubhalu141-bit/stellarforge) | MIT (own) | Inspiration for the cinema screenplay → storyboard → shot-list flow and director notes UI |
| **commercial-video-studio (GitHub)** | [kalubhalu141-bit/commercial-video-studio](https://github.com/kalubhalu141-bit/commercial-video-studio) | MIT (own) | Inspiration for engine catalog structure |
| **cinematic-dating-video (GitHub)** | [kalubhalu141-bit/cinematic-dating-video](https://github.com/kalubhalu141-bit/cinematic-dating-video) | MIT (own) | Inspiration for Ken Burns photo-to-video pattern (already implemented in base Studio tab) |
| **blender-ai-studio (GitHub)** | [kalubhalu141-bit/blender-ai-studio](https://github.com/kalubhalu141-bit/blender-ai-studio) | MIT (own) | Inspiration for the modular engine registry |
| **Three.js** | [mrdoob/three.js](https://github.com/mrdoob/three.js) | MIT | Core 3D engine used by the 🎥 3D Video tab — 109k★, the foundation of all in-browser WebGL |
| **pmndrs/postprocessing** | [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) | Zlib (≈MIT permissive) | EffectComposer / bloom / vignette / chromatic-aberration patterns. Inspired the fx-canvas composite stack. **No code copied.** |

## Inspirations — text-to-video foundation models (NOT code-merged)

These are the real open-source T2V/I2V model repos. They are **far too large
to bundle** (multi-GB weights, Python training/inference code) — we cite them
so you can run them locally and **pipe their output into this app's
MediaRecorder / ffmpeg export stage** if you want real generative video.

| Project | Source | License | What we drew from |
|---|---|---|---|
| **AnimateDiff** | [guoyww/AnimateDiff](https://github.com/guoyww/AnimateDiff) | Apache-2.0 | 12k★ — temporal coherence via eased motion, motion module concept. 16-frame animations on SD-1.5. **No code copied.** |
| **Wan 2.2** (Alibaba) | [Wan-Video/Wan2.2](https://github.com/Wan-Video/Wan2.2) | Apache-2.0 | 5B MoE T2V/I2V at 720p@24fps, runs on 4090. Cinematic aesthetic data with lighting/composition/contrast/color-tone labels — directly inspired our LUT pipeline and director style notes. **No code copied.** |
| **HunyuanVideo** (Tencent) | [Tencent-Hunyuan/HunyuanVideo](https://github.com/Tencent-Hunyuan/HunyuanVideo) | **Tencent Hunyuan Community License** (custom, NOT MIT/Apache) | 13B T2V model, Tencent's flagship. **License is restrictive** (see "Tencent license" section below). **No code copied, no weights downloaded.** Cited for completeness. |
| **LTX-Video** (Lightricks) | [Lightricks/LTX-Video](https://github.com/Lightricks/LTX-Video) | Apache-2.0 | 10B asymmetric diffusion transformer, 128× video VAE compression, 30fps faster-than-real-time on 4090. Inspired the "fast iteration" framing in the README. **No code copied.** |
| **Open-Sora** (HPCAI) | [hpcaitech/Open-Sora](https://github.com/hpcaitech/Open-Sora) | Apache-2.0 | 29k★ — "democratizing efficient video production". The 11B version benchmarks near HunyuanVideo. **No code copied.** |
| **StableAnimator** | [Francis-Rings/StableAnimator](https://github.com/Francis-Rings/StableAnimator) | MIT | CVPR2025, end-to-end ID-preserving human animation (pose-driven). **No code copied.** |
| **Open-Generative-AI** | [Anil-matcha/Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) | MIT | 400+ model aggregator. Inspired the engine-catalog concept. **No code copied.** |
| **WebGPU-Video-Diffusion (WebT2V)** | [WebGPU-Video-Diffusion/WebGPU-Video-Diffusion](https://github.com/WebGPU-Video-Diffusion/WebGPU-Video-Diffusion) | academic (no LICENSE file) | Penn CIS 5650 — Text-to-Video Zero (Khachatryan et al. 2023) in WebGPU. Inspired the 8-frame keyframe mock in the WebGPU engine. **No code copied.** |

## Inspirations — VFX / post-processing / motion graphics

| Project | Source | License | What we drew from |
|---|---|---|---|
| **Deforum** (Stable Diffusion) | [deforum-art/sd-webui-deforum](https://github.com/deforum-art/sd-webui-deforum) | Other (no permissive license) | 2.8k★ — 2D/3D camera-verb easing, prompt interpolation. Inspired the camera-move math (`easeInOutCubic`). **No code copied.** |
| **PANDORA** (22eme Arkane) | [22eme-Arkane/PANDORA](https://github.com/22eme-Arkane/PANDORA) | **GPL v3** (NOT compatible with this MIT project — patterns only) | Cinema pre-production workflow: screenplay → storyboard → shot list → per-shot generation. **No code copied — clean-room re-implementation.** |
| **Lottie / lottie-web** (Airbnb) | [airbnb/lottie-web](https://github.com/airbnb/lottie-web) | MIT | 32k★ — After Effects → web animations. Inspiration for the kinetic-title 2D engine. **No code copied.** |
| **Filament** (Google) | [google/filament](https://github.com/google/filament) | Apache-2.0 | Real-time PBR engine. Inspired the logo-reveal PBR look. **No code copied.** |
| **three-mesh-bvh** | [gkjohnson/three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) | MIT | 3.3k★ — accelerated raycasting. Cited for future use in scene picking. **No code copied.** |

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

## Licenses — quick reference

- **MIT** — permissive, allows merge with attribution
- **Apache-2.0** — permissive, requires NOTICE file (we comply via this file)
- **Zlib** — permissive, ≈MIT (used by pmndrs/postprocessing)
- **GPL v3** — copyleft, **NOT compatible** with MIT — inspiration only
- **Tencent Hunyuan Community License** — custom, restrictive, NOT MIT-compatible
- **Other / academic** — check before use; inspiration only

## How to comply

If you fork or redistribute this repository:

1. **Keep** the `LICENSE` (MIT) and `THIRD_PARTY.md` (this file) intact.
2. **Keep** all `LICENSE` files in any third-party code you add.
3. **Do NOT** import GPL-licensed or Hunyuan-licensed code into this
   codebase — both would force the whole project to their license.
4. The Apache-2.0 NOTICE requirement is satisfied by this THIRD_PARTY.md
   (AnimateDiff, transformers.js, Wan 2.2, LTX-Video, Open-Sora, Filament).
5. WebGPU-Video-Diffusion has no LICENSE file; treat as "academic use",
   patterns only.
6. If you add HunyuanVideo inference: bundle Tencent's LICENSE.txt and the
   required NOTICE file in your distribution.

## Issues / corrections

If a license is wrong or a credit is missing, please open a GitHub issue
on the repo.
