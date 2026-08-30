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

## Inspirations (NOT code-merged — patterns and ideas only)

| Project | Source | License | What we drew from |
|---|---|---|---|
| **AnimateDiff** | [guoyww/AnimateDiff](https://github.com/guoyww/AnimateDiff) | Apache-2.0 | Temporal coherence via eased motion, motion module concept. No code copied. |
| **StableAnimator** | [Francis-Rings/StableAnimator](https://github.com/Francis-Rings/StableAnimator) | MIT | Identity-preserving video diffusion. Concept only — no code copied. |
| **Open-Generative-AI** | [Anil-matcha/Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) | MIT | Multi-model aggregator idea. No code copied. |
| **WebGPU-Video-Diffusion (WebT2V)** | [WebGPU-Video-Diffusion/WebGPU-Video-Diffusion](https://github.com/WebGPU-Video-Diffusion/WebGPU-Video-Diffusion) | academic (no LICENSE file) | Text-to-Video Zero pipeline (Khachatryan et al. 2023). Inspired the 8-frame keyframe mock in the WebGPU engine. **No code copied.** |
| **PANDORA** | [22eme-Arkane/PANDORA](https://github.com/22eme-Arkane/PANDORA) | **GPL v3** (NOT compatible with this MIT project — patterns only) | Cinema pre-production workflow: screenplay → storyboard → shot list → per-shot generation. **No code copied — clean-room re-implementation.** |
| **Deforum** | [deforum-art/sd-webui-deforum](https://github.com/deforum-art/sd-webui-deforum) | Other (no permissive license) | Camera-verb easing and 2D/3D mode math. **No code copied.** |

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

## Licenses — quick reference

- **MIT** — permissive, allows merge with attribution
- **Apache-2.0** — permissive, requires NOTICE file (we comply via this file)
- **GPL v3** — copyleft, **NOT compatible** with MIT — inspiration only
- **Other / academic** — check before use; inspiration only

## How to comply

If you fork or redistribute this repository:

1. **Keep** the `LICENSE` (MIT) and `THIRD_PARTY.md` (this file) intact.
2. **Keep** all `LICENSE` files in any third-party code you add.
3. **Do NOT** import GPL-licensed code into this codebase — it would
   force the whole project to become GPL.
4. The Apache-2.0 NOTICE requirement is satisfied by this THIRD_PARTY.md
   (AnimateDiff, transformers.js).
5. WebGPU-Video-Diffusion has no LICENSE file; treat as "academic use",
   patterns only.

## Issues / corrections

If a license is wrong or a credit is missing, please open a GitHub issue
on the repo.
