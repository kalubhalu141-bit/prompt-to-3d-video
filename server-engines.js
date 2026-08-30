// ∞ Infinity Video Generator — AI engine registry (zero-dep, no key).
// Each engine is a deterministic free "AI" function. Input names are sent
// by the frontend as in_<name>=value; runEngine strips the prefix.
'use strict';
const SEED = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const pick = (arr, seed) => arr[seed % arr.length];
const moodOf = t => /epic|galaxy|space|battle|action|explos|war/i.test(t) ? 'epic'
  : /calm|ocean|sunrise|relax|peace|meditat/i.test(t) ? 'calm'
  : /neon|cyber|night|synth|futur|hacker/i.test(t) ? 'neon'
  : /dark|noir|horror|myst|shadow|crime/i.test(t) ? 'dark'
  : /happy|joy|family|warm|heart|food|travel/i.test(t) ? 'warm' : 'balanced';
const ENGINES = [
  // ---------- Scripting ----------
  { key: 'script', label: '📜 Script Outline', group: 'Scripting', inputs: [['prompt', 'Video idea…', ''], ['duration', 'Seconds', '30']], desc: 'Beat-by-beat script outline with timing' },
  { key: 'voiceover', label: '🎙 Voiceover Script', group: 'Scripting', inputs: [['prompt', 'Video idea…', ''], ['words', 'Words', '60']], desc: 'Draft narration for your video' },
  { key: 'hook', label: '🪝 Hook Generator', group: 'Scripting', inputs: [['topic', 'Topic…', ''], ['style', 'hook style (question, shock, story…)', 'question']], desc: 'First-3-seconds hooks that stop the scroll' },
  { key: 'titles', label: '🏷 Title Ideas', group: 'Scripting', inputs: [['topic', 'Topic…', ''], ['style', 'mix', 'mix']], desc: '10 click-worthy title variants' },
  { key: 'description', label: '📝 Description', group: 'Scripting', inputs: [['prompt', 'What is the video about?', ''], ['title', 'Title (optional)', '']], desc: 'Full description + hashtags block' },
  { key: 'dialogue', label: '💬 Dialogue Lines', group: 'Scripting', inputs: [['scene', 'Scene / situation…', ''], ['chars', 'Characters (comma separated)', 'Narrator, Host']], desc: 'Realistic dialogue for a scene' },
  // ---------- Directing ----------
  { key: 'storyboard', label: '🎞 Storyboard Beats', group: 'Directing', inputs: [['prompt', 'Idea…', ''], ['shots', 'Shots', '4']], desc: 'Shot-by-shot storyboard with camera + duration' },
  { key: 'shotlist', label: '🎬 Shot List', group: 'Directing', inputs: [['prompt', 'Video idea…', '']], desc: 'Six production-ready shots' },
  { key: 'broll', label: '🎥 B-Roll Ideas', group: 'Directing', inputs: [['topic', 'Topic…', '']], desc: 'Coverage shots + stock search phrases' },
  { key: 'pacing', label: '⏱ Pacing Table', group: 'Directing', inputs: [['duration', 'Seconds', '30'], ['scenes', 'Scenes', '5']], desc: 'Scene timing table with tempo labels' },
  { key: 'camera', label: '📷 Camera Moves', group: 'Directing', inputs: [['mood', 'Mood…', 'epic']], desc: 'Camera language matched to mood' },
  { key: 'transitions', label: '🌀 Transitions', group: 'Directing', inputs: [['mood', 'Mood…', 'epic'], ['count', 'How many', '5']], desc: 'Transition set matched to mood' },
  // ---------- Look ----------
  { key: 'palette', label: '🎨 Color Palette', group: 'Look', inputs: [['mood', 'Mood (epic, calm, neon…)', 'epic']], desc: '5-color cinematic palette' },
  { key: 'lut', label: '🎞 LUT / Grade', group: 'Look', inputs: [['mood', 'Mood…', 'epic']], desc: 'Color-grade recipe (shadows/mids/highs)' },
  { key: 'fonts', label: '🔤 Font Pairing', group: 'Look', inputs: [['mood', 'Mood…', 'epic']], desc: 'Title font + body font pairing' },
  { key: 'lighting', label: '💡 Lighting Setup', group: 'Look', inputs: [['mood', 'Mood…', 'epic']], desc: '3-point + practical lighting plan' },
  // ---------- Planning ----------
  { key: 'aspect', label: '📐 Aspect Advisor', group: 'Planning', inputs: [['idea', 'Video idea…', ''], ['platform', 'Platform', 'youtube']], desc: 'Best aspect ratio + resolution per platform' },
  { key: 'resolution', label: '🖥 Resolution Guide', group: 'Planning', inputs: [['platform', 'Platform', 'youtube']], desc: 'Export specs per platform' },
  { key: 'credits', label: '💠 Credit Estimator', group: 'Planning', inputs: [['duration', 'Seconds', '30']], desc: 'Estimate render credits' },
  { key: 'budget', label: '💰 Budget Planner', group: 'Planning', inputs: [['duration', 'Seconds', '30'], ['gear', 'Gear level (budget/pro/set)', 'budget']], desc: 'Zero-to-pro production budget' },
  { key: 'release', label: '📅 Release Plan', group: 'Planning', inputs: [['platform', 'Platform', 'youtube']], desc: 'Best posting times + cadence' },
  // ---------- Audio ----------
  { key: 'voice', label: '🗣 Voice Picker', group: 'Audio', inputs: [['mood', 'Mood…', 'epic']], desc: 'Voice direction (tone, rate, style)' },
  { key: 'music', label: '🎵 Music Picker', group: 'Audio', inputs: [['mood', 'Mood…', 'epic']], desc: 'Genre, BPM, energy, waveform recipe' },
  { key: 'soundfx', label: '🔊 Sound FX List', group: 'Audio', inputs: [['scene', 'Scene…', 'city night']], desc: 'Diegetic SFX layer list' },
  { key: 'mix', label: '🎚 Audio Mix Recipe', group: 'Audio', inputs: [['mood', 'Mood…', 'epic']], desc: 'Voice/music/SFX level recipe' },
  // ---------- Production ----------
  { key: 'captions', label: '💬 Caption Styles', group: 'Production', inputs: [['mood', 'Mood…', 'epic']], desc: 'Subtitle style presets (font, color, position)' },
  { key: 'chapters', label: '📑 Chapters', group: 'Production', inputs: [['script', 'Script lines (newline separated)', '']], desc: 'YouTube chapter timestamps' },
  { key: 'intro', label: '🎬 Intro Design', group: 'Production', inputs: [['topic', 'Topic…', '']], desc: '3-second logo/name intro concept' },
  { key: 'outro', label: '🏁 Outro Design', group: 'Production', inputs: [['topic', 'Topic…', '']], desc: 'End-screen with subscribe CTA' },
  { key: 'export', label: '📦 Export Checklist', group: 'Production', inputs: [['platform', 'Platform', 'youtube']], desc: 'Pre-upload checklist per platform' },
  // ---------- Publish ----------
  { key: 'tags', label: '#️⃣ Hashtag Pack', group: 'Publish', inputs: [['topic', 'Topic…', '']], desc: '15 working hashtags' },
  { key: 'keywords', label: '🔑 Keyword Pack', group: 'Publish', inputs: [['topic', 'Topic…', '']], desc: 'Search keywords for metadata' },
  { key: 'seo', label: '📈 Title SEO Score', group: 'Publish', inputs: [['title', 'Video title…', '']], desc: 'Score + fixes for your title' },
  { key: 'thumbnail', label: '🖼 Thumbnail Prompt', group: 'Publish', inputs: [['topic', 'Topic…', '']], desc: 'AI image prompt for a click-worthy thumbnail' },
  { key: 'schedule', label: '🗓 Posting Schedule', group: 'Publish', inputs: [['platform', 'Platform', 'youtube']], desc: 'Weekly posting cadence plan' },
  // ---------- Strategy ----------
  { key: 'audience', label: '👥 Audience Map', group: 'Strategy', inputs: [['topic', 'Topic…', '']], desc: 'Who watches this + what they want' },
  { key: 'cta', label: '🎯 CTA Builder', group: 'Strategy', inputs: [['topic', 'Topic…', '']], desc: 'Call-to-action options by goal' },
  { key: 'series', label: '📺 Series Concept', group: 'Strategy', inputs: [['topic', 'Topic…', ''], ['episodes', 'Episodes', '5']], desc: 'Episodic content arc' },
  { key: 'pivot', label: '🔄 Pivot Ideas', group: 'Strategy', inputs: [['topic', 'Current niche…', '']], desc: 'Adjacent angles to expand reach' },
  // ---------- Community ----------
  { key: 'challenges', label: '🏆 Challenge Ideas', group: 'Community', inputs: [['topic', 'Topic…', '']], desc: 'Community challenges + hashtag' },
  { key: 'collab', label: '🤝 Collab Pitch', group: 'Community', inputs: [['topic', 'Topic…', '']], desc: 'Collab formats + outreach line' },
  { key: 'comments', label: '💬 Comment Replies', group: 'Community', inputs: [['topic', 'Topic…', ''], ['tone', 'Tone (friendly, funny, pro)', 'friendly']], desc: 'Reply templates for engagement' },
  // ---------- Business ----------
  { key: 'pricing', label: '💵 Pricing Ideas', group: 'Business', inputs: [['topic', 'Service / niche…', '']], desc: '3-tier offer structure' },
  { key: 'sponsor', label: '🤖 Sponsor Deck', group: 'Business', inputs: [['topic', 'Channel niche…', '']], desc: 'Sponsor pitch one-pager' },
  { key: 'analytics', label: '📊 KPI Targets', group: 'Business', inputs: [['platform', 'Platform', 'youtube']], desc: 'What to track + healthy benchmarks' },
  // ---------- Branding ----------
  { key: 'slogan', label: '💡 Slogan Ideas', group: 'Branding', inputs: [['topic', 'Brand / channel…', '']], desc: '10 short memorable slogans' },
  { key: 'logo', label: '🖌 Logo Prompt', group: 'Branding', inputs: [['name', 'Brand name…', ''], ['style', 'Style…', 'minimal neon']], desc: 'AI logo prompt for Image Studio' },
  { key: 'bio', label: '✍️ Channel Bio', group: 'Branding', inputs: [['topic', 'What you make…', '']], desc: 'Bio for every platform' }
];

function runEngine(key, input) {
  const e = ENGINES.find(x => x.key === key);
  if (!e) return { error: 'unknown engine: ' + key };
  const s = (k, d) => String(input[k] || d || '');
  const n = (k, d) => { const v = parseFloat(input[k]); return isNaN(v) ? d : v; };
  const p = s('prompt') || s('topic') || s('idea');
  const m = moodOf(p + ' ' + s('mood'));
  let out;
  switch (key) {
    case 'script': {
      const dur = n('duration', 30);
      const kinds = ['Hook —', 'Setup —', 'Build —', 'Climax —', 'Payoff —', 'CTA —'];
      const beats = [];
      const lines = String(p).split(/[.!?\n]/).filter(x => x.trim());
      const nB = Math.max(3, Math.min(6, Math.round(dur / 6)));
      for (let i = 0; i < nB; i++) {
        const t = Math.round(dur / nB * i);
        const line = lines[i] ? lines[i].trim() : pick(['Show the core idea in action', 'Explain why it matters now', 'Add a surprising detail', 'Compare before / after', 'Summarize the key takeaway'], SEED(p + i));
        beats.push({ time: Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'), kind: kinds[i % 6].replace(' —', ''), line: line.slice(0, 90) });
      }
      out = { beats, total: dur + 's', tip: 'Paste into Studio → Script & Voiceover and generate TTS' };
      break;
    }
    case 'voiceover': {
      const w = Math.max(20, Math.min(200, Math.round(n('words', 60))));
      const openers = ['Welcome to a journey where', 'Imagine a world where', 'In this video, we explore', 'Watch closely as'];
      const middles = ['Every detail tells a story', 'The motion carries the emotion', 'Light shapes the scene', 'Precision meets creativity'];
      const closers = ['Stay tuned for more', 'Subscribe for the next chapter', 'This is only the beginning', 'Share this with a creator'];
      out = { mood: m, script: (openers[SEED(p) % 4] + ' ' + p + '. ' + middles[SEED(p + 'm') % 4] + '. ' + closers[SEED(p + 'c') % 4] + '.').slice(0, w * 6), words: w + ' words ≈ ' + Math.round(w / 2.5) + 's of speech', tip: 'Paste into 🗣 TTS Voiceover Studio (or Studio step 3)' };
      break;
    }
    case 'hook': {
      const t = s('topic'); const st = s('style', 'question').toLowerCase();
      const hooks = st.includes('shock') ? ['Nobody talks about the ' + t + ' secret…', 'Stop doing ' + t + ' the wrong way', 'This ' + t + ' hack is illegal in 3 countries'] :
        st.includes('story') ? ['I tried ' + t + ' for 30 days…', 'The day ' + t + ' changed everything', 'My $0 ' + t + ' setup story'] :
        st.includes('number') ? ['5 ' + t + ' mistakes you keep making', '3 ' + t + ' tools that feel like cheating', '10 ' + t + ' facts in 60 seconds'] :
        ['Want to master ' + t + '? Start here', 'Why everyone is wrong about ' + t, 'The ' + t + ' guide they hid from you', t + ' — but explained simply'];
      out = { hooks: hooks.map((h, i) => (i + 1) + '. ' + h), style: st, tip: 'Keep the hook under 3 seconds — say it in the first line of your script' };
      break;
    }
    case 'titles': {
      const t = s('topic').slice(0, 40); const st = s('style', 'mix');
      const A = ['How to ', 'Why ', 'The Truth About ', 'I Tried ', 'Stop Doing ', 'The Ultimate '];
      const B = [' in 2026', ' (Full Guide)', ' Nobody Told You', ' — 5 Steps', ' Explained', ' That Actually Works'];
      const titles = [];
      for (let i = 0; i < 10; i++) titles.push((A[(SEED(t) + i) % A.length] + t + B[(SEED(t + i) + i * 2) % B.length]).slice(0, 70));
      if (st !== 'mix') titles.push(t + ' — ' + st + ' edition');
      out = { titles: titles.slice(0, 10), tip: 'Pick the one with a number + curiosity gap' };
      break;
    }
    case 'description': {
      const t = s('title') || p.split(/[,.]/)[0].slice(0, 60);
      out = { title: t, description: p + '\n\nMade with ∞ Infinity Video Generator — free on-device AI, no watermark.\n\n🎬 Shot with cinematic ' + m + ' grade · 🎵 AI music bed · ✨ 100% free tools', hashtags: '#InfinityVideo #AIVideo #FreeAI #' + m };
      break;
    }
    case 'dialogue': {
      const scene = s('scene'); const chars = s('chars', 'Narrator, Host').split(',').map(x => x.trim()).filter(Boolean);
      const lines = [];
      const beat = ['(enters, looking around) “Is this really it?”', '(grins) “Wait until you see the next part.”', '(whispers) “Okay — this is where it gets interesting.”', '(laughs) “That was not part of the plan.”', '(serious) “Here is what actually matters…”'];
      for (let i = 0; i < 5; i++) lines.push(chars[i % chars.length] + ': ' + beat[(SEED(scene) + i) % beat.length]);
      out = { scene, lines, tip: 'Adjust the names, then paste into your script' };
      break;
    }
    case 'storyboard': {
      const shots = Math.max(2, Math.min(8, Math.round(n('shots', 4))));
      const cams = ['wide establishing', 'medium master', 'close-up detail', 'POV', 'aerial drone', 'low-angle hero', 'tracking follow', 'over-the-shoulder'];
      const verbs = ['reveal', 'push-in', 'pivot', 'dolly in', 'whip pan', 'slow zoom', 'crane up', 'handheld'];
      out = { mood: m, beats: Array.from({ length: shots }, (_, i) => ({ beat: i + 1, cam: cams[(SEED(p) + i) % cams.length], action: p + ' — ' + verbs[(SEED(p + i) + i) % verbs.length] + ' shot', dur: pick([4, 5, 6, 7], SEED(p + 'd' + i)) + 's' })) };
      break;
    }
    case 'shotlist': {
      const shots = ['Wide establishing shot', 'Medium master shot', 'Close-up detail', 'Tracking following action', 'Over-the-shoulder POV', 'Low-angle hero shot', 'Aerial drone view', 'Slow push-in reveal'].sort(() => SEED(p + m) % 2 ? 1 : -1).slice(0, 6);
      out = { mood: m, shots: shots.map((sh, i) => (i + 1) + '. ' + sh + ' — ' + pick(['5s', '6s', '4s', '7s'], SEED(p + i)) + ', ' + pick(['24mm wide', '35mm', '50mm', '85mm', '100mm macro'], SEED(p + sh))) };
      break;
    }
    case 'broll': {
      const t = s('topic');
      const shots = ['extreme close-up of details', 'slow pan across the scene', 'hands working / product in use', 'people reacting naturally', 'light and shadow play', 'aerial context shot', 'texture macro shot', 'time-lapse of the setting'].sort(() => SEED(t) % 2 ? 1 : -1).slice(0, 6);
      out = { topic: t, mood: m, broll: shots.map((x, i) => (i + 1) + '. ' + x + ' — search: "' + t + ' ' + x.split(' ').slice(0, 3).join(' ') + '"') };
      break;
    }
    case 'pacing': {
      const dur = n('duration', 30), scenes = Math.max(1, Math.round(n('scenes', 5)));
      const per = Math.round(dur / scenes);
      out = { total: dur + 's', scenes, perScene: per + 's', table: Array.from({ length: scenes }, (_, i) => ({ scene: i + 1, start: i * per + 's', end: Math.min((i + 1) * per, dur) + 's', length: per + 's', tempo: per >= 8 ? 'slow / epic' : per >= 5 ? 'medium' : 'fast cut' })) };
      break;
    }
    case 'camera': {
      const map = { epic: ['low-angle hero push-in', 'aerial reveal', 'dolly zoom on subject'], calm: ['slow lateral drift', 'gentle push-in', 'static tripod frames'], neon: ['whip pans', 'Dutch-angle tilts', 'fast tracking'], dark: ['slow creeping dolly', 'shallow-focus close-ups', 'camera jitter'], warm: ['handheld bounce', 'sunlit over-shoulder', 'smooth orbit'], balanced: ['medium tripod frames', 'occasional slider move', 'subtle handheld'] };
      out = { mood: m, moves: map[m] || map.balanced };
      break;
    }
    case 'transitions': {
      const cnt = Math.max(2, Math.min(10, Math.round(n('count', 5))));
      const map = { epic: ['flash white', 'impact zoom', 'light leak sweep'], calm: ['crossfade', 'dip to black', 'soft blur'], neon: ['glitch', 'chromatic smear', 'slice wipe'], dark: ['hard cut', 'smash cut', 'letterbox slam'], warm: ['crossfade', 'round iris', 'slide'], balanced: ['crossfade', 'cut on action', 'fade through white'] };
      const set = map[m] || map.balanced;
      out = { mood: m, transitions: Array.from({ length: cnt }, (_, i) => (i + 1) + '. ' + set[i % set.length] + (i >= set.length ? ' (repeat)' : '')) };
      break;
    }
    case 'palette': {
      const pal = {
        epic: ['#0b0f1e', '#27e1c1', '#7c5cff', '#ff9a3d', '#ffffff'],
        calm: ['#0e2233', '#7fd4c1', '#c9e4de', '#f2e8cf', '#ffffff'],
        neon: ['#12002b', '#ff2ea6', '#00e5ff', '#ffe600', '#ffffff'],
        dark: ['#050505', '#3a3a3a', '#8b0000', '#b8b8b8', '#ffffff'],
        warm: ['#2b1608', '#ffb347', '#ff7e5f', '#f7d794', '#ffffff'],
        balanced: ['#101820', '#f2aa4c', '#3b8ea5', '#e8e8e8', '#ffffff']
      }[m] || ['#101820', '#f2aa4c', '#3b8ea5', '#e8e8e8', '#ffffff'];
      out = { mood: m, palette: pal, usage: '1: background · 2: primary accent · 3: secondary · 4: highlights · 5: text', css: 'background:#' + pal[0] + ';color:#' + pal[4] + ';border:2px solid #' + pal[1] };
      break;
    }
    case 'lut': {
      const map = { epic: ['shadows: teal-green', 'mids: neutral', 'highs: warm skin', 'contrast: high', 'saturation: +10%'], calm: ['shadows: soft blue', 'mids: airy', 'highs: cream', 'contrast: low', 'saturation: -15%'], neon: ['shadows: purple', 'mids: magenta', 'highs: cyan', 'contrast: high', 'saturation: +30%'], dark: ['shadows: crushed black', 'mids: desaturated', 'highs: cool grey', 'contrast: very high', 'saturation: -25%'], warm: ['shadows: amber', 'mids: golden', 'highs: peach', 'contrast: medium', 'saturation: +15%'], balanced: ['shadows: neutral', 'mids: clean', 'highs: soft white', 'contrast: medium', 'saturation: +5%'] };
      out = { mood: m, grade: map[m] || map.balanced };
      break;
    }
    case 'fonts': {
      const map = { epic: ['Cinzel / Montserrat', 'sans-serif caps, letter-spaced', 'title: 64px, gold gradient'], calm: ['Lora / Inter', 'serif body, airy spacing', 'title: 48px, cream'], neon: ['Orbitron / Rajdhani', 'geometric, techy', 'title: 72px, cyan glow'], dark: ['Oswald / Roboto', 'condensed, heavy', 'title: 56px, blood red'], warm: ['Poppins / Nunito', 'rounded, friendly', 'title: 52px, amber'], balanced: ['Inter / Source Sans', 'clean, neutral', 'title: 50px, white'] };
      out = { mood: m, ...(map[m] || map.balanced) };
      break;
    }
    case 'lighting': {
      const map = { epic: ['key: 1.2kW hard light', 'fill: 4× bounce', 'rim: magenta gel', 'practical: city bokeh'], calm: ['key: large softbox', 'fill: natural bounce', 'rim: none', 'practical: window light'], neon: ['key: RGB panel (magenta)', 'fill: cyan strip', 'rim: blue edge light', 'practical: neon signs'], dark: ['key: single practical', 'fill: none (high contrast)', 'rim: white 1/8', 'practical: desk lamp'], warm: ['key: sun through sheer', 'fill: gold reflector', 'rim: warm edge', 'practical: fairy lights'], balanced: ['key: 3-light classic', 'fill: softbox 45°', 'rim: hair light', 'practical: ambient'] };
      out = { mood: m, setup: map[m] || map.balanced };
      break;
    }
    case 'aspect': {
      const plat = s('platform', 'youtube').toLowerCase();
      const map = { youtube: ['16:9', '1920×1080', 'best for most content'], shorts: ['9:16', '1080×1920', 'vertical, max reach'], instagram: ['4:5', '1080×1350', 'feed + reels hybrid'], tiktok: ['9:16', '1080×1920', 'full vertical'], linkedin: ['16:9', '1920×1080', 'professional feed'] };
      out = { platform: plat, aspect: (map[plat] || map.youtube)[0], resolution: (map[plat] || map.youtube)[1], note: (map[plat] || map.youtube)[2], mood: m };
      break;
    }
    case 'resolution': {
      const plat = s('platform', 'youtube').toLowerCase();
      const map = { youtube: ['1920×1080', '30 fps', 'H.264 MP4'], shorts: ['1080×1920', '30 fps', 'H.264 MP4'], instagram: ['1080×1350', '30 fps', 'H.264 MP4'], tiktok: ['1080×1920', '30 fps', 'H.264 MP4'], linkedin: ['1920×1080', '30 fps', 'H.264 MP4'] };
      out = { platform: plat, ...(map[plat] || map.youtube) };
      break;
    }
    case 'credits': {
      const dur = n('duration', 30);
      out = { duration: dur + 's', credits: Math.max(1, Math.round(dur / 4)), note: '~1 credit per 4s of render. GIF + poster exports are free.' };
      break;
    }
    case 'budget': {
      const gear = s('gear', 'budget');
      const dur = n('duration', 30);
      const tiers = { budget: ['phone camera — $0', 'free lights (window + lamp)', 'capcut / this studio — $0', 'Total: $0'], pro: ['mirrorless body — $1500', 'softbox kit — $250', 'shotgun mic — $120', 'Total: ~$1900 one-time'], set: ['cinema camera — $8000', 'LED kit — $2000', 'wireless lav — $400', 'Total: ~$10k one-time'] };
      out = { gear, budget: tiers[gear] || tiers.budget, tip: dur + 's video needs no extra kit at budget level' };
      break;
    }
    case 'release': {
      const plat = s('platform', 'youtube');
      const map = { youtube: ['post Tue–Thu 5–8pm', '1–2 long videos / week', '+ 2–3 Shorts between'], tiktok: ['post daily 7–10pm', '3–5 shorts / week', 'hook in first 1.5s'], instagram: ['post 3–4× / week', 'reels 6–9pm', 'stories daily'], linkedin: ['post Tue–Thu 8–10am', '1 video / week', 'text + video combo'] };
      out = { platform: plat, ...(map[plat] || map.youtube) };
      break;
    }
    case 'voice': {
      const map = { epic: { voice: 'kiran', rate: 0.9, style: 'deep, dramatic' }, calm: { voice: 'aria', rate: 0.95, style: 'soft, warm' }, neon: { voice: 'nova', rate: 1.1, style: 'energetic, punchy' }, dark: { voice: 'ram', rate: 0.85, style: 'low, tense' }, warm: { voice: 'aria', rate: 1.0, style: 'friendly, bright' }, balanced: { voice: 'meera', rate: 1.0, style: 'neutral, clear' } };
      out = { mood: m, ...(map[m] || map.balanced) };
      break;
    }
    case 'music': {
      const map = { epic: { genre: 'Cinematic Trailer', tempo: 120, energy: 'high', wave: 'minor arp + percussion risers' }, calm: { genre: 'Ambient Lo-fi', tempo: 72, energy: 'low', wave: 'soft pads + vinyl crackle' }, neon: { genre: 'Synthwave', tempo: 104, energy: 'high', wave: '16th-note arp + sidechain pulse' }, dark: { genre: 'Dark Drone', tempo: 60, energy: 'low', wave: 'dissonant drone + sub bass' }, warm: { genre: 'Upbeat Pop', tempo: 118, energy: 'medium', wave: 'major keys + claps' }, balanced: { genre: 'Corporate Ambient', tempo: 96, energy: 'medium', wave: 'clean guitar + soft beat' } };
      out = { mood: m, ...(map[m] || map.balanced) };
      break;
    }
    case 'soundfx': {
      const scene = s('scene', 'city night');
      const fx = ['ambience: ' + scene + ' room tone', 'whoosh: transition passes', 'riser: builds into each beat', 'impact: on text reveals', 'sub-drop: section changes', 'click: UI / icon moments'].sort(() => SEED(scene) % 2 ? 1 : -1);
      out = { scene, fx: fx.map((x, i) => (i + 1) + '. ' + x) };
      break;
    }
    case 'mix': {
      const map = { epic: ['voice: -6 dB', 'music: -18 dB (ducks to -24)', 'sfx: -12 dB'], calm: ['voice: -6 dB', 'music: -20 dB', 'sfx: -16 dB'], neon: ['voice: -4 dB', 'music: -16 dB', 'sfx: -10 dB'], dark: ['voice: -5 dB', 'music: -22 dB', 'sfx: -14 dB'], warm: ['voice: -6 dB', 'music: -17 dB', 'sfx: -13 dB'], balanced: ['voice: -6 dB', 'music: -18 dB', 'sfx: -14 dB'] };
      out = { mood: m, mix: map[m] || map.balanced };
      break;
    }
    case 'captions': {
      const map = { epic: ['font: Montserrat ExtraBold', 'color: white + black stroke', 'position: center-bottom', 'case: UPPERCASE'], calm: ['font: Lora', 'color: cream', 'position: lower third', 'case: sentence'], neon: ['font: Orbitron', 'color: cyan + glow', 'position: center', 'case: UPPERCASE'], dark: ['font: Oswald', 'color: grey', 'position: bottom', 'case: sentence'], warm: ['font: Poppins', 'color: white', 'position: lower third', 'case: sentence'], balanced: ['font: Inter SemiBold', 'color: white + soft shadow', 'position: bottom', 'case: sentence'] };
      out = { mood: m, style: map[m] || map.balanced };
      break;
    }
    case 'chapters': {
      const lines = s('script').split('\n').map(x => x.trim()).filter(Boolean);
      const per = lines.length ? Math.max(2, Math.round(60 / lines.length)) : 0;
      out = { chapters: lines.map((l, i) => '0:' + String(i * per).padStart(2, '0') + ' — ' + l.slice(0, 60)) };
      break;
    }
    case 'intro': {
      const t = s('topic');
      out = { intro: ['0–3s: logo slam + your name', 'visual: ' + t + ' speed-ramp montage', 'audio: riser into music downbeat', 'text: 3-word promise'], tip: 'Generate a 1280×720 logo frame in Image Studio' };
      break;
    }
    case 'outro': {
      const t = s('topic');
      out = { outro: ['last 8s: recap 3 key points as text', 'visual: subscribe button + next video tile', 'audio: music resolves, voice CTA', 'text: "Watch next →"'], tip: 'Keep the CTA under 5 words' };
      break;
    }
    case 'export': {
      const plat = s('platform', 'youtube');
      out = { platform: plat, checklist: ['render at native resolution', 'burn in subtitles if sound-off viewing', 'thumbnail 1280×720 ready', 'title under 70 chars', 'description with timestamps', 'tags + hashtags added', 'end screen linked'] };
      break;
    }
    case 'tags': {
      const t = s('topic');
      const base = t.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean).slice(0, 3);
      out = { tags: ['#' + base.join('#'), '#' + base[0], '#' + base[1], '#' + base[2], '#' + base.join(''), '#shorts', '#viral', '#ai', '#video', '#trending', '#creator', '#content'].filter(Boolean).slice(0, 15) };
      break;
    }
    case 'keywords': {
      const t = s('topic');
      const base = t.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
      out = { keywords: [t, ...base, t + ' tutorial', t + ' 2026', 'how to ' + base[0] || t, t + ' explained', 'best ' + t, t + ' for beginners'].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 12) };
      break;
    }
    case 'seo': {
      const t = s('title');
      const len = t.length;
      const words = t.split(/\s+/).filter(Boolean).length;
      let score = 40;
      if (len >= 30 && len <= 70) score += 25; else if (len > 70) score += 10;
      if (words >= 5) score += 15;
      if (/\d/.test(t)) score += 10;
      if (/[?!]/.test(t)) score += 10;
      score = Math.min(100, score);
      out = { title: t, score: score + '/100', verdict: score >= 80 ? 'Strong — add a curiosity gap to go further' : score >= 60 ? 'Good — try adding a number or question' : 'Weak — make it 30–70 chars, specific, benefit-led', tips: ['Include the main keyword in the first 4 words', 'Add a number (list, %, year)', 'End with a question or promise'] };
      break;
    }
    case 'thumbnail': {
      const t = s('topic');
      out = { prompt: t + ', bold high-contrast thumbnail composition, dramatic ' + m + ' lighting, vibrant colors, clear focal subject, 1280x720, no text', tip: 'Generate in 🎨 Image Studio (Flux), then add a bold 3-word overlay' };
      break;
    }
    case 'schedule': {
      const plat = s('platform', 'youtube');
      const map = { youtube: ['Mon: Short', 'Tue: main video', 'Thu: Short', 'Fri: main video', 'Sun: community post'], tiktok: ['daily short, 7–10pm', 'trend sound check each morning'], instagram: ['Mon/Wed/Fri reels', 'Sat: carousel', 'daily stories'], linkedin: ['Tue/Thu video posts', 'Mon: text insight', 'Fri: roundup'] };
      out = { platform: plat, plan: map[plat] || map.youtube };
      break;
    }
    case 'audience': {
      const t = s('topic');
      const personas = ['The beginner — wants the basics fast', 'The enthusiast — wants depth + secrets', 'The creator — wants to reuse it in their work', 'The skeptic — wants proof it works'];
      out = { topic: t, personas: personas.map((x, i) => (i + 1) + '. ' + x), tip: 'Address ONE persona per video' };
      break;
    }
    case 'cta': {
      const t = s('topic');
      out = { topic: t, options: ['💬 "Comment your take below"', '👍 "Like if this saved you time"', '🔔 "Subscribe — part 2 drops Friday"', '📥 "Download the free checklist (link)"', '➡ "Watch the full tutorial next"'] };
      break;
    }
    case 'series': {
      const t = s('topic'); const eps = Math.max(3, Math.min(12, Math.round(n('episodes', 5))));
      out = { series: t + ' — mini-series', episodes: Array.from({ length: eps }, (_, i) => 'EP' + (i + 1) + ': ' + ['The basics', 'Common mistakes', 'Pro workflow', 'Real example', 'Tools & setup', 'Advanced tips', 'Case study', 'Q&A', 'Behind the scenes', 'Speedrun', 'Review', 'Finale'][i % 12] + ' of ' + t) };
      break;
    }
    case 'pivot': {
      const t = s('topic');
      out = { pivots: [t + ' for beginners', t + ' for pros', t + ' mistakes to avoid', t + ' tools comparison', 'reacting to ' + t + ' takes', t + ' in 60 seconds', 'the business of ' + t, t + ' history & future'].map((x, i) => (i + 1) + '. ' + x) };
      break;
    }
    case 'challenges': {
      const t = s('topic');
      out = { challenge: t + ' 7-day challenge', hashtag: '#' + t.replace(/[^a-z0-9]/gi, '') + 'Challenge', rules: ['post one ' + t + ' clip daily', 'tag the channel', 'use the challenge sound', 'top entry featured'], tip: 'Challenges compound reach — run one monthly' };
      break;
    }
    case 'collab': {
      const t = s('topic');
      out = { formats: ['duet / stitch exchange', 'guest interview (15 min)', 'swap tutorials', 'collab challenge'], outreach: 'Hey! I run a channel about ' + t + ' and love your recent video on the topic. Want to do a quick collab?' };
      break;
    }
    case 'comments': {
      const t = s('topic'); const tone = s('tone', 'friendly');
      const opens = tone === 'pro' ? ['Thanks — glad you noticed the detail.', 'Great question. Short answer: yes.'] : tone === 'funny' ? ['Ha! You caught me.', 'This comment wins today.'] : ['Thanks for watching!', 'Really glad you liked it.'];
      out = { replies: [opens[0] + ' More ' + t + ' content is on the way.', opens[1] + ' Check the pinned comment for the full breakdown.', 'Agreed — ' + t + ' is underrated. What part did you find most useful?'] };
      break;
    }
    case 'pricing': {
      const t = s('topic');
      out = { offers: ['Starter: ' + t + ' essentials — free (lead magnet)', 'Pro: full ' + t + ' workflow — $29/mo or $199/yr', 'Agency: ' + t + ' done-for-you — custom'], tip: 'Anchor with the free tier first' };
      break;
    }
    case 'sponsor': {
      const t = s('topic');
      out = { pitch: ['Who: brands in ' + t + ' / adjacent niches', 'Audience: engaged viewers (watch time avg 60%+)', 'Formats: 60s mid-roll, 15s bumper, dedicated video', 'Rates: start at $CMP per 1k views'], tip: 'Build a one-page media kit with your best 3 videos' };
      break;
    }
    case 'analytics': {
      const plat = s('platform', 'youtube');
      const map = { youtube: ['CTR > 4–6%', 'AVD > 50%', 'retention first 30s > 70%', 'subs/video > 1% of views'], tiktok: ['watch-through > 30%', 'share rate > 1%', 'profile visits > 10% of views'], instagram: ['saves > 1%', 'shares > 1%', 'reach > 30% followers'], linkedin: ['impressions > 10k/video', 'engagement > 3%', 'profile views +30%'] };
      out = { platform: plat, kpis: map[plat] || map.youtube };
      break;
    }
    case 'slogan': {
      const t = s('topic');
      const A = ['Make', 'Master', 'Create', 'Own', 'Unlock', 'Enjoy'];
      const B = ['every day', 'your way', 'the future', 'more', 'better content', 'with confidence'];
      out = { slogans: Array.from({ length: 10 }, (_, i) => (A[(SEED(t) + i) % A.length] + ' ' + t + ' ' + B[(SEED(t + i) + i) % B.length]).slice(0, 50)) };
      break;
    }
    case 'logo': {
      const name = s('name', 'My Channel'); const style = s('style', 'minimal neon');
      out = { prompt: 'minimal logo for "' + name + '", ' + style + ', flat vector, dark background, centered, 1024x1024', tip: 'Paste into Image Studio with square size' };
      break;
    }
    case 'bio': {
      const t = s('topic');
      out = { bio: 'I make videos about ' + t + ' — simple, practical, zero fluff. New video every week. Subscribe for the next one. 🎬', shorts: t.slice(0, 30) + ' · new videos weekly', link: 'link in bio → watch the latest ' + t + ' video' };
      break;
    }
    default: out = { error: 'unhandled' };
  }
  return { engine: 'rules', key, _label: e.label, _mode: 'deterministic free AI (rule-based, no key)', input, result: out };
}
module.exports = { ENGINES, runEngine, listEngines: () => ENGINES.map(e => ({ key: e.key, label: e.label, group: e.group, inputs: e.inputs, desc: e.desc || '' })) };
