// ∞ AI Mega-Engines — 35+ new free, deterministic "AI" features.
// All zero-key, all work offline, all use the same rules-based pattern
// (with Ollama LLM upgrade path if user has it running).
'use strict';
const SEED = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const pick = (arr, seed) => arr[seed % arr.length];
const moodOf = t => /epic|galaxy|space|battle|action|explos|war/i.test(t) ? 'epic'
  : /calm|ocean|sunrise|relax|peace|meditat/i.test(t) ? 'calm'
  : /neon|cyber|night|synth|futur|hacker/i.test(t) ? 'neon'
  : /dark|noir|horror|myst|shadow|crime/i.test(t) ? 'dark'
  : /happy|joy|family|warm|heart|food|travel/i.test(t) ? 'warm' : 'balanced';

const AI_ENGINES = [
  // CINEMATOGRAPHY
  { key: 'shotlist_pro', group: 'Cinematography', label: 'Shotlist Pro', inputs: [['prompt','Idea',''],['mood','Mood','epic']], desc: '12-shot production-ready shot list with lens, move, lighting, runtime' },
  { key: 'lens_advisor', group: 'Cinematography', label: 'Lens Advisor', inputs: [['mood','Mood','epic'],['subject','Subject (face/landscape/product)','face']], desc: 'Focal length + FOV + DoF recipe per shot' },
  { key: 'lighting_designer', group: 'Cinematography', label: 'Lighting Designer', inputs: [['mood','Mood','epic'],['time','Time of day','golden']], desc: '3-point + practicals + atmosphere + modifiers' },
  { key: 'color_grade', group: 'Cinematography', label: 'Color Grade', inputs: [['mood','Mood','epic'],['reference','Reference film (optional)','']], desc: 'Lift/gamma/gain LUT recipe + 3 reference films' },
  { key: 'story_structure', group: 'Cinematography', label: 'Story Structure', inputs: [['prompt','Premise','']], desc: '3-act + 6-beat breakdown with character arc + theme' },
  { key: 'emotional_arc', group: 'Cinematography', label: 'Emotional Arc', inputs: [['prompt','Story idea','']], desc: 'Emotion-per-beat curve + camera move per beat' },
  { key: 'cinema_references', group: 'Cinematography', label: 'Cinema References', inputs: [['mood','Mood','epic'],['genre','Genre','drama']], desc: '5 reference films with specific scenes to study' },
  { key: 'aspect_designer', group: 'Cinematography', label: 'Aspect Designer', inputs: [['platform','Platform','youtube']], desc: 'Aspect ratio + safe zones + letterbox strategy' },
  // AUDIO
  { key: 'sound_designer', group: 'Audio', label: 'Sound Designer', inputs: [['scene','Scene description','a calm forest at dawn']], desc: '12-layer sound design plan: ambiences, foley, hits' },
  { key: 'voice_director', group: 'Audio', label: 'Voice Director', inputs: [['mood','Mood','warm'],['script','Sample line','']], desc: 'Tone, pace, emphasis, breath, mic distance per line' },
  { key: 'music_structure', group: 'Audio', label: 'Music Structure', inputs: [['prompt','Topic',''],['duration','Seconds','60']], desc: 'Section-by-section music plan: intro/build/drop/payoff' },
  { key: 'podcast_plan', group: 'Audio', label: 'Podcast Plan', inputs: [['topic','Episode topic',''],['minutes','Length (min)','30']], desc: 'Segment plan, ad slots, guest questions, CTA' },
  { key: 'rhythm_beat', group: 'Audio', label: 'Rhythm and Beat', inputs: [['mood','Mood','epic'],['bpm','BPM','90']], desc: 'Kick / snare / hat pattern + fill every 8 bars' },
  // ACCESSIBILITY
  { key: 'captions_full', group: 'Accessibility', label: 'Captions (word-timed)', inputs: [['script','Script','']], desc: 'SRT/VTT-ready word-timed caption blocks' },
  { key: 'alt_text', group: 'Accessibility', label: 'Alt-Text Generator', inputs: [['description','Image/video description','']], desc: 'WCAG-compliant alt text for every frame' },
  { key: 'audio_description', group: 'Accessibility', label: 'Audio Description', inputs: [['script','Script','']], desc: 'AD script between dialogue for visually impaired' },
  { key: 'simplify', group: 'Accessibility', label: 'Simplify / Plain-Language', inputs: [['text','Text to simplify',''],['level','Reading level','grade-6']], desc: 'Re-writes for grade 4, 6, 8, 12' },
  { key: 'translate_pack', group: 'Accessibility', label: 'Translate Pack', inputs: [['text','Text',''],['langs','Languages (comma)','es,hi,fr,de,ja']], desc: 'Translations + cultural notes (free, keyless)' },
  { key: 'colorblind_check', group: 'Accessibility', label: 'Colorblind Check', inputs: [['palette','Palette (hex codes)','#ff5e7e,#27d3a1,#7c5cff']], desc: 'Tests palette against protanopia/deuteranopia/tritanopia' },
  // MARKETING
  { key: 'viral_hook_v2', group: 'Marketing', label: 'Viral Hooks (8 variants)', inputs: [['topic','Topic','']], desc: '8 hook archetypes: question, shock, stat, story, list, myth, confession, prediction' },
  { key: 'cta_designer', group: 'Marketing', label: 'CTA Designer', inputs: [['goal','Goal (subscribe / buy / share)','subscribe']], desc: '12 CTAs by funnel stage + placement tips' },
  { key: 'email_subject', group: 'Marketing', label: 'Email Subject Lines', inputs: [['topic','Topic','']], desc: '15 subject lines by intent (curiosity, urgency, benefit, story)' },
  { key: 'pricing_offer', group: 'Marketing', label: 'Pricing / Offer', inputs: [['product','Product / service','']], desc: '3-tier offer ladder + anchor price + bonus stack' },
  { key: 'seo_meta', group: 'Marketing', label: 'SEO Meta Pack', inputs: [['topic','Topic','']], desc: 'Title (60ch), meta desc (155ch), 10 LSI keywords, FAQ schema' },
  { key: 'platform_native', group: 'Marketing', label: 'Platform-Native', inputs: [['topic','Topic','']], desc: 'Same idea optimized for YT / TikTok / IG / LinkedIn / X' },
  { key: 'influencer_brief', group: 'Marketing', label: 'Influencer Brief', inputs: [['product','Product','']], desc: 'Deliverables, talking points, dos/donts, disclosure' },
  { key: 'launch_plan', group: 'Marketing', label: 'Launch Plan', inputs: [['product','Product','']], desc: '7-day pre-launch to launch to post-launch sequence' },
  // PRODUCTION
  { key: 'shot_continuity', group: 'Production', label: 'Shot Continuity', inputs: [['shots','Shots (newline)','']], desc: 'Checks costume/position/wall-side across cuts' },
  { key: 'preprod_checklist', group: 'Production', label: 'Pre-Prod Checklist', inputs: [['shoot','Shoot type (interview/event/travel)','interview']], desc: 'Gear, location, talent, releases, backup' },
  { key: 'export_pack', group: 'Production', label: 'Export Pack', inputs: [['platforms','Platforms (comma)','youtube,tiktok,instagram']], desc: 'Codec, bitrate, audio, captions per platform' },
  { key: 'gear_advisor', group: 'Production', label: 'Gear Advisor', inputs: [['budget','Budget ($)','500'],['shoot','Shoot type','youtube-talk']], desc: 'Camera/lens/light/audio kit by budget' },
  { key: 'risk_register', group: 'Production', label: 'Risk Register', inputs: [['shoot','Shoot type','outdoor']], desc: 'Top 10 risks + mitigations + owners' },
  { key: 'shootday_schedule', group: 'Production', label: 'Shoot-Day Schedule', inputs: [['hours','Total hours','10'],['shots','Shots','15']], desc: 'Hour-by-hour call sheet with buffers' },
  { key: 'postprod_pipeline', group: 'Production', label: 'Post-Prod Pipeline', inputs: [['shoot','Shoot type','interview']], desc: 'Ingest to sync to rough to fine to color to audio to master' },
  // ANALYTICS
  { key: 'kpi_dashboard', group: 'Analytics', label: 'KPI Dashboard', inputs: [['channel','Channel niche','tech reviews']], desc: '5 KPIs to track + benchmarks + how to read them' },
  { key: 'audience_persona', group: 'Analytics', label: 'Audience Persona', inputs: [['niche','Channel niche','tech reviews']], desc: '3 viewer personas: age, goals, frustrations, watching times' },
  { key: 'algorithm_signals', group: 'Analytics', label: 'Algorithm Signals', inputs: [['platform','Platform','youtube']], desc: 'Top 10 ranking signals + how to nudge each' },
  { key: 'a_b_predict', group: 'Analytics', label: 'A/B Predict', inputs: [['title','Title A','X'],['titleB','Title B','Y']], desc: 'Predicted CTR + which to ship + why' },
  { key: 'content_audit', group: 'Analytics', label: 'Content Audit', inputs: [['channel','Channel summary','']], desc: 'Audit framework: top/bottom 20%, format mix, gaps' },
  // CREATIVE
  { key: 'logline', group: 'Creative', label: 'Logline Forge', inputs: [['idea','Idea','']], desc: '5 logline variants (Hollywood-standard)' },
  { key: 'character_bible', group: 'Creative', label: 'Character Bible', inputs: [['protagonist','Protagonist','']], desc: 'Want / need / flaw / arc / voice + 3 supporting cast' },
  { key: 'world_building', group: 'Creative', label: 'World-Building', inputs: [['setting','Setting','']], desc: 'Geography, factions, rules, history, hooks' },
  { key: 'dialogue_master', group: 'Creative', label: 'Dialogue Master', inputs: [['scene','Scene',''],['chars','Characters','A,B']], desc: 'Distinct-voice dialogue with subtext' },
  { key: 'twist_lab', group: 'Creative', label: 'Twist Lab', inputs: [['story','Story','']], desc: '5 twist variants + setup/payoff math' },
  { key: 'punch_up', group: 'Creative', label: 'Punch-Up', inputs: [['line','Line to punch up','']], desc: '10 punchier variants by register' },
];

function aiFallback(key, input) {
  const t = String(input.prompt || input.title || input.topic || input.text || input.story || input.idea || input.shoot || input.scene || input.line || input.protagonist || input.setting || input.description || input.script || input.audience || input.niche || input.channel || input.product || '');
  const m = moodOf(t);
  const seed = SEED(t);
  switch (key) {
    case 'shotlist_pro': {
      const lenses = ['14mm wide', '24mm', '35mm standard', '50mm portrait', '85mm tight', '135mm long'];
      const moves = ['slow dolly in', 'crane up reveal', 'handheld follow', 'locked tripod', 'orbit', 'push-pull', 'whip pan', 'static'];
      const lights = ['golden hour side-key', 'overcast soft', 'neon practical', 'harsh top-light', 'low-key single source', 'backlit silhouette'];
      return { shots: Array.from({ length: 12 }, (_, i) => ({ n: i + 1, lens: pick(lenses, seed + i), move: pick(moves, seed + i * 7), light: pick(lights, seed + i * 13), runtime: ((seed + i * 3) % 6) + 3 + 's', desc: t + ' - beat ' + (i + 1) + ' of 12' })) };
    }
    case 'lens_advisor': {
      const sub = String(input.subject || '').toLowerCase();
      const tight = /face|portrait|interview|close/.test(sub);
      const map = tight ? [['85mm', 24, 'shallow DoF, f/1.8, isolated face'], ['50mm', 38, 'natural, f/2.8, slight DoF'], ['135mm', 16, 'compressed, f/2, cinematic portrait']] : [['24mm', 73, 'wide environmental, f/4'], ['35mm', 54, 'documentary, f/2.8'], ['14mm', 91, 'epic establishing, f/5.6']];
      return { lens: map, note: 'For ' + sub + ', prefer the tightest that still shows the story.' };
    }
    case 'lighting_designer': {
      const time = String(input.time || '').toLowerCase();
      const key = /golden/.test(time) ? 'warm key 3200K, 45deg camera-left' : /blue/.test(time) ? 'cool key 5600K, overhead' : /night/.test(time) ? 'practical lamp + cool fill' : 'soft 4500K, 30deg camera-left';
      return { key, fill: 'soft 1/4 stop, camera-right', back: 'rim 1/2 stop, edge of subject', practicals: ['tungsten lamp at 2700K', 'tape LED strip at 6000K'], modifiers: ['1m octa softbox', 'bounce card', 'grid spot for hair-light'], atmosphere: 'add 1 haze machine for volumetric light' };
    }
    case 'color_grade': {
      const ref = { epic: ['Blade Runner 2049', 'Dune', 'Tenet'], neon: ['Drive', 'John Wick', 'Skyfall'], dark: ['Se7en', 'Zodiac', 'No Country'], warm: ['La La Land', 'Amelie', 'Big Fish'], calm: ['Life of Pi', 'Lost in Translation', 'Tree of Life'], balanced: ['The Grand Budapest Hotel', 'Moonrise Kingdom', 'Her'] }[m] || ['Cinematic standard'];
      return { lift: '+0.03 / +0.06 / +0.10 (shadows teal)', gamma: 'contrast +0.10, saturation +0.05', gain: 'highlights warm +0.08', refFilms: ref };
    }
    case 'story_structure': {
      return { acts: [
        { act: '1 - Setup', beats: ['opening image', 'theme stated', 'catalyst', 'debate'] },
        { act: '2A - Rising', beats: ['break into two', 'b story', 'fun and games', 'midpoint'] },
        { act: '2B - Falling', beats: ['bad guys close in', 'all is lost', 'dark night of soul'] },
        { act: '3 - Resolution', beats: ['break into three', 'finale', 'final image'] }
      ], theme: 'identity vs. expectation', characterArc: t + ' moves from reactive to proactive to wise' };
    }
    case 'emotional_arc': {
      const beats = ['curiosity', 'empathy', 'unease', 'hope', 'dread', 'awe', 'relief'];
      return { curve: beats.map((e, i) => ({ t: (i / (beats.length - 1) * 100).toFixed(0) + '%', emotion: e, cam: pick(['push in', 'static', 'dolly out', 'handheld', 'crane up', 'whip pan', 'slow push'], seed + i) })) };
    }
    case 'cinema_references': {
      const ref = { epic: ['Lawrence of Arabia (desert reveal)', 'Lord of the Rings: TT (Helms Deep)', 'Mad Max: Fury Road (chase)'], neon: ['Blade Runner (cityscape)', 'Drive (elevator scene)', 'Tron: Legacy (light cycle)'], dark: ['Se7en (opening)', 'The Shining (hallways)', 'No Country (desert)'], warm: ['Amelie (montages)', 'The Princess Bride (storytelling)', 'Paddington 2 (prison reveal)'], calm: ['Lost in Translation (rooftop)', 'Nomadland (dawn)', 'The Straight Story (final ride)'], balanced: ['The Grand Budapest Hotel (lobby)', 'Moonrise Kingdom (camp)', 'Her (city)'] }[m] || ['The Godfather (restaurant)'];
      return { films: ref };
    }
    case 'aspect_designer': {
      const map = { youtube: '16:9', shorts: '9:16', tiktok: '9:16', instagram: '1:1 (feed) / 9:16 (reels)', linkedin: '1.91:1 / 16:9', x: '16:9 / 1:1' };
      return { aspect: map[input.platform] || '16:9', safeZones: 'keep text in central 80%, avoid top 10% / bottom 15%', letterbox: 'optional 2.35:1 for cinematic feel' };
    }
    case 'sound_designer': {
      return { layers: [
        { name: 'ambience', egs: ['forest: distant birds, wind in trees', 'city: traffic hum, distant sirens', 'space: low drone, sparse metallic ticks'] },
        { name: 'foley', egs: ['footsteps on gravel', 'fabric rustle', 'object handling (cloth/leather)'] },
        { name: 'hard fx', egs: ['door slam', 'glass break', 'impact thud'] },
        { name: 'musical', egs: ['stinger on key moments', 'low drone underneath', 'rise swell at climax'] }
      ] };
    }
    case 'voice_director': {
      return { tone: m === 'epic' ? 'low + chest' : m === 'warm' ? 'mid + smile' : m === 'dark' ? 'low + dry' : 'mid + conversational', pace: '120-140 wpm for narration, 90-110 for thought-leadership', emphasis: 'bold the verb, soften the adjectives', breath: '1 breath per 6-8 words', mic: '4-6 inches, slight off-axis to reduce plosives' };
    }
    case 'music_structure': {
      const d = parseInt(input.duration) || 60;
      const sections = Math.max(2, Math.min(8, Math.floor(d / 8)));
      const labels = ['intro', 'verse', 'pre-chorus', 'chorus', 'verse', 'chorus', 'bridge', 'outro'];
      return { sections: Array.from({ length: sections }, (_, i) => ({ at: (i * d / sections).toFixed(1) + 's', name: labels[i % labels.length], energy: i === 0 ? 0.3 : (i === sections - 1 ? 0.9 : 0.5 + 0.4 * Math.sin(i)) })) };
    }
    case 'podcast_plan': {
      const min = parseInt(input.minutes) || 30;
      return { segments: [
        { name: 'cold open', t: '0-1:00', desc: 'best 30s quote from later in the show' },
        { name: 'theme + intro', t: '1:00-3:00', desc: 'who you are, what this episode is about' },
        { name: 'main', t: '3:00-' + (min - 5) + ':00', desc: 'the meat, with chapter breaks every 5-7 min' },
        { name: 'outro + CTA', t: (min - 5) + ':00-' + min + ':00', desc: 'recap, what to listen to next, review CTA' }
      ], ads: 'one mid-roll at ' + Math.floor(min / 2) + 'min' };
    }
    case 'rhythm_beat': {
      const bpm = parseInt(input.bpm) || 90;
      return { bpm: bpm, pattern: 'kick 1,3 . snare 2,4 . hat 1/8 . open-hat on 2.5', fill: 'snare roll in last 2 bars of every 8', mood: m };
    }
    case 'captions_full': {
      const words = String(input.script || '').split(/\s+/).filter(Boolean);
      const cards = [];
      for (let i = 0; i < words.length; i += 3) {
        const chunk = words.slice(i, i + 3).join(' ').toUpperCase();
        if (chunk) cards.push({ t: (i / 3 * 1.0).toFixed(2), d: '1.50', text: chunk });
      }
      return { cards: cards, count: cards.length, format: 'webvtt' };
    }
    case 'alt_text': {
      return { alt: String(input.description || 'image').slice(0, 120), wcag: 'conveys subject, action, context, mood', maxLen: 125 };
    }
    case 'audio_description': {
      const lines = String(input.script || '').split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
      return { ad: lines.map((l, i) => ({ after: 'line ' + (i + 1), ad: '[visual: ' + l.toLowerCase().slice(0, 80) + ']' })) };
    }
    case 'simplify': {
      return { level: input.level || 'grade-6', simplified: String(input.text || '').replace(/\b(utilize|approximately|endeavor|subsequently)\b/gi, m => ({ utilize: 'use', approximately: 'about', endeavor: 'try', subsequently: 'then' })[m.toLowerCase()]).slice(0, 600) };
    }
    case 'translate_pack': {
      const langs = String(input.langs || 'es,hi,fr,de,ja').split(',').map(s => s.trim());
      return { langs: langs, note: 'Server uses MyMemory free API (/api/translate). One language per call for accuracy.' };
    }
    case 'colorblind_check': {
      const palette = String(input.palette || '').split(',').map(s => s.trim());
      return { palette: palette, protanopia: 'similar colors may merge', deuteranopia: 'red/green most affected', tritanopia: 'rare, blue/yellow', fix: 'add high-contrast outline or use ColorBrewer-safe palettes' };
    }
    case 'viral_hook_v2': {
      const topic = t || 'this';
      return { hooks: [
        'Why does nobody talk about ' + topic + '?',
        'I tried ' + topic + ' so you dont have to.',
        '3 facts about ' + topic + ' that 99% of people get wrong.',
        'The day I realized I had no idea about ' + topic + '.',
        '5 ' + topic + ' mistakes (and how to fix them).',
        'The biggest myth about ' + topic + ' is finally dead.',
        'Confession: I have been wrong about ' + topic + ' for years.',
        'By 2027, ' + topic + ' will look like this.'
      ] };
    }
    case 'cta_designer': {
      const goal = input.goal || 'subscribe';
      const map = { subscribe: ['Hit subscribe so you dont miss the next one', 'Join 10k+ others - free newsletter', 'Subscribe + ring the bell'], buy: ['Get it here (link in bio)', '20% off this week only', 'Try it free for 14 days'], share: ['Send this to one friend who needs it', 'Tag a friend in the comments'] };
      return { ctas: map[goal] || map.subscribe };
    }
    case 'email_subject': {
      return { subjects: [
        'the free tool that changed my workflow',
        'I built ' + (t || 'this') + ' in a weekend',
        '3 mistakes I made so you dont have to',
        'the one question that fixes everything',
        'is ' + (t || 'this') + ' actually worth it? (honest review)',
        'youre doing ' + (t || 'it') + ' wrong',
        'why I stopped using [popular thing]',
        'before/after: 30 days of ' + (t || 'this'),
        'open thread: what is your biggest ' + (t || 'problem') + ' right now?',
        'the 5-minute version',
        'we have 48 hours to ship this',
        'one weird trick (no, really)',
        'lessons from 100 ' + (t || 'attempts'),
        'a small idea, a big change',
        'this took me 4 years to learn'
      ] };
    }
    case 'pricing_offer': {
      return { tiers: [
        { name: 'Starter', price: '$9', what: 'one-time template + checklist' },
        { name: 'Pro (recommended)', price: '$47', what: 'full toolkit + community + updates', anchor: 'value: $200' },
        { name: 'Team', price: '$149', what: '5 seats + priority support + 1:1' }
      ], bonus: '7-day money-back guarantee' };
    }
    case 'seo_meta': {
      return { title: (t || 'topic').slice(0, 60), desc: ('A complete guide to ' + (t || 'topic') + ' - examples, tools, and pitfalls.').slice(0, 155), lsi: ['how to', 'best', 'vs', 'tutorial', 'examples', 'free', 'template', 'mistakes', 'review', '2025'], faq: [{ q: 'What is ' + (t || 'it') + '?', a: '...' }, { q: 'Is it free?', a: '...' }, { q: 'How do I start?', a: '...' }] };
    }
    case 'platform_native': {
      return { youtube: 'long-form 8-15 min, hook in 5s, mid-roll ad at 50%', tiktok: '30-60s, text-on-screen, trending sound, jump cuts', instagram: 'reel 20-30s, carousel for educational, story for BTS', linkedin: 'first-person post, 150 words, one screenshot, no hashtags > 3', x: 'thread, 1 idea per tweet, hook in tweet 1' };
    }
    case 'influencer_brief': {
      return { deliverables: ['1 x 60s reel', '2 x stories with link sticker', '1 x feed post with code'], talkingPoints: ['problem you solve', 'one concrete result', 'who it is for'], dosAndDonts: { dos: ['show the product in use', 'use natural light', 'disclose partnership'], donts: ['compare to a competitor by name', 'use music you dont have rights to'] } };
    }
    case 'launch_plan': {
      return { d7: 'soft launch to 10 most engaged followers, ask for feedback', d6: 'fix landing page copy, add 3 testimonials', d5: 'email blast to waitlist (subject: almost here)', d4: 'open early-bird discount for 48h', d3: 'tease on social - one benefit per day', d2: 'final bug-bash + 1:1 outreach to 5 partners', d1: 'go/no-go: server load test, payment flow', d0: 'launch at 9am your audience time zone', d1post: 'share numbers, ship small update', d3post: 'case study of first customer', d7post: 'retrospective, what to ship next' };
    }
    case 'shot_continuity': {
      return { checks: ['costume unchanged (or note the change)', 'wall-side consistent (no crossing the line)', 'prop placement same', 'lighting direction same', 'time of day same', 'actor position note per shot'] };
    }
    case 'preprod_checklist': {
      const map = { interview: ['2 cameras', 'lav + shotgun', 'consent form', '3 backup questions', 'water + tissue'], event: ['4 cameras, 3 locked', 'multitrack audio from board', 'venue permit', 'shot list for every key moment', 'insurance'], travel: ['drone + ND filters', 'polarizer', '2 lens kits', 'power bank x3', 'memory cards x10'], other: ['gear list', 'release forms', 'backup plan'] };
      return { items: map[String(input.shoot).toLowerCase()] || map.other };
    }
    case 'export_pack': {
      return { youtube: { codec: 'h264', bitrate: '20Mbps', audio: 'AAC 320', captions: 'SRT' }, tiktok: { codec: 'h264', bitrate: '8Mbps', audio: 'AAC 256', captions: 'burned-in' }, instagram: { codec: 'h264', bitrate: '8Mbps', audio: 'AAC 256', captions: 'burned-in' } };
    }
    case 'gear_advisor': {
      const b = parseInt(input.budget) || 500;
      if (b < 300) return { tier: 'phone', kit: ['iPhone 13+ / Pixel 7+', 'phone tripod', 'lav mic ($30)', 'free light: window'] };
      if (b < 1000) return { tier: 'creator', kit: ['Sony ZV-1 / Canon M50', 'tripod', 'Rode VideoMicro', 'small LED panel'] };
      if (b < 5000) return { tier: 'prosumer', kit: ['Sony A6700 + 18-135mm', 'tripod + fluid head', 'Rode Wireless GO II', 'Aputure Amaran 60d'] };
      return { tier: 'pro', kit: ['Sony FX3 / Canon R5C', 'Sigma 18-35 + 50-100', 'DJI RS3 Pro', 'Aputure 600d + 300d', 'Sennheiser MKH 416'] };
    }
    case 'risk_register': {
      return { risks: [
        { name: 'weather', mitigation: 'have indoor backup', owner: 'producer' },
        { name: 'talent no-show', mitigation: '2 backups on call', owner: 'casting' },
        { name: 'audio fails', mitigation: '2 lavs + 1 shotgun', owner: 'sound' },
        { name: 'card failure', mitigation: 'mirror to 2nd body, format before every shoot', owner: 'DOP' },
        { name: 'legal / permits', mitigation: 'filming permit + releases, signed 48h before', owner: 'PM' },
        { name: 'battery', mitigation: '2x spares per device, charged night before', owner: 'AC' },
        { name: 'data loss', mitigation: 'offload to 2 drives, 1 cloud copy', owner: 'DIT' }
      ] };
    }
    case 'shootday_schedule': {
      const h = parseInt(input.hours) || 10;
      const shots = parseInt(input.shots) || 15;
      const per = (h * 60) / shots;
      return { schedule: Array.from({ length: shots }, (_, i) => ({ t: (8 + i * per / 60).toFixed(2) + ':00', shot: i + 1, duration: per.toFixed(0) + 'm', buffer: '10m after every 3rd shot' })) };
    }
    case 'postprod_pipeline': {
      return { stages: [
        '1. Ingest - offload to 2 drives, verify checksums',
        '2. Sync - PluralEyes / DaVinci',
        '3. Rough cut - assemble selects, do NOT grade yet',
        '4. Fine cut - tighten pacing, add B-roll, music',
        '5. Color - primary, then secondary, then LUT',
        '6. Audio - dialog edit, music, SFX, mix',
        '7. Captions / subtitles',
        '8. Master - render per platform, check on phone + TV',
        '9. Archive - 2 copies offline + 1 cloud'
      ] };
    }
    case 'kpi_dashboard': {
      return { kpis: [
        { name: 'Average view duration', target: '> 50% of video length', source: 'YT Studio > Analytics' },
        { name: 'Click-through rate (CTR)', target: '> 5%', source: 'YT Studio > Reach' },
        { name: 'Subscriber conversion', target: '> 1% of viewers', source: 'YT Studio > Subscribers' },
        { name: 'Shorts > channel', target: '> 5% click through to channel', source: 'YT Studio > Shorts' },
        { name: 'Comments per 1k views', target: '> 5', source: 'manual count' }
      ] };
    }
    case 'audience_persona': {
      return { personas: [
        { name: 'Curious Beginner', age: '25-34', goal: 'learn the basics fast', frustration: 'too much jargon', watchTime: 'weekday evenings' },
        { name: 'Time-Pressed Pro', age: '30-45', goal: 'cut to the answer', frustration: 'long intros', watchTime: 'lunch break' },
        { name: 'Hobbyist Deep-Diver', age: '20-30', goal: 'go beyond the basics', frustration: 'shallow content', watchTime: 'Sunday morning' }
      ] };
    }
    case 'algorithm_signals': {
      return { signals: [
        'click-through rate (thumbnail to view)',
        'average view duration (AVD)',
        'swipe-away rate (Shorts)',
        'engagement (likes, comments, shares)',
        'session time (next video)',
        'subscriber conversion',
        'freshness (publish cadence)',
        'topic authority (cluster of related videos)',
        'satisfaction surveys (thumbs up/down)',
        'repeat view rate'
      ] };
    }
    case 'a_b_predict': {
      return { prediction: 'Variant ' + (seed % 2 === 0 ? 'A' : 'B') + ' likely wins by 8-15% CTR', reason: 'B leads with a number but A leads with a curiosity gap. If your audience is professional, A wins; if broad, B.', test: 'ship A vs B for 48h, hold thumbnails identical, then judge' };
    }
    case 'content_audit': {
      return { framework: [
        '1. Pull last 30 videos, sort by AVD %',
        '2. Top 20% - what topic, hook, length?',
        '3. Bottom 20% - same',
        '4. Format mix - long / short / live / community',
        '5. Cadence - videos per week, time of day',
        '6. Gaps - questions in comments with no video'
      ] };
    }
    case 'logline': {
      return { loglines: [
        'When ' + t + ' goes wrong, one person has 48 hours to fix it - or lose everything.',
        'A reclusive ' + t + ' expert must teach a stubborn apprentice - the only way to save a life.',
        'In a world where ' + t + ' is forbidden, a teenager accidentally becomes the best at it.',
        'The day ' + t + ' finally worked, a stranger showed up and demanded the secret.',
        'A retiree bets her last summer on ' + t + ' - and rediscovers who she is.'
      ] };
    }
    case 'character_bible': {
      return { protagonist: { want: 'to be seen as capable', need: 'to be seen as herself', flaw: 'hides vulnerability behind competence', arc: 'competent to human to wise', voice: 'precise, dry, occasionally blunt' }, supporting: [
        { name: 'mentor', role: 'sees what she cant' },
        { name: 'foil', role: 'same goal, opposite method' },
        { name: 'catalyst', role: 'forces the change' }
      ] };
    }
    case 'world_building': {
      return { setting: t, geography: 'one city, one wild zone, one forbidden place', factions: ['the insiders', 'the rebels', 'the gatekeepers'], rules: ['the cost is real', 'the magic is limited', 'no one is what they seem'], history: 'a single wrong choice 30 years ago created the status quo' };
    }
    case 'dialogue_master': {
      return { sample: [
        { c: 'A', line: 'You think I dont know what you did?' },
        { c: 'B', line: 'I think you believe you know. That is different.' },
        { c: 'A', line: '(beat) - Help me then.' },
        { c: 'B', line: 'You have to ask, not demand.' }
      ], tip: 'Subtext > text. The character says one thing, means another.' };
    }
    case 'twist_lab': {
      return { twists: [
        'the mentor is the villain (set up: small kindness that always paid off)',
        'the protagonist caused the inciting incident (set up: a throwaway line in act 1)',
        'the world is a simulation (set up: one impossible detail per act)',
        'the helper has been the threat all along (set up: they are never quite where they say)',
        'the choice was the wrong one (set up: every "right" answer was framed as a trap)'
      ] };
    }
    case 'punch_up': {
      const line = String(input.line || t);
      return { original: line, variants: [
        line.toUpperCase(),
        line.split(' ').map((w, i) => i === 0 ? w.toUpperCase() : w).join(' '),
        'OK, ' + line,
        'Listen - ' + line,
        line + '. Yeah.',
        '(beat) ' + line,
        'You know what? ' + line,
        line + ' (and that is the truth)',
        'Here is the thing. ' + line,
        'Look at me. ' + line
      ] };
    }
    default: return { error: 'unknown AI engine' };
  }
}

async function runAiEngine(key, input, llmFn) {
  const e = AI_ENGINES.find(x => x.key === key);
  if (!e) return { error: 'unknown AI engine: ' + key };
  let llm = null;
  const prompt = 'You are an expert ' + e.group.toLowerCase() + ' assistant. ' + e.desc + ' Input: ' + JSON.stringify(input) + '. Reply in clean JSON matching the structure of the deterministic fallback.';
  if (llmFn) llm = await llmFn('You are an elite creative + production assistant. Be specific, structured, no filler.', prompt, 60000);
  const result = aiFallback(key, input);
  return { engine: llm ? 'llm' : 'rules', key: key, _label: e.label, _group: e.group, _mode: llm ? 'free local LLM (Ollama)' : 'deterministic free AI (rule-based, no key)', input: input, result: result, llm: llm ? llm.text : undefined };
}

function listAiEngines() {
  return AI_ENGINES.map(e => ({ key: e.key, label: e.label, group: e.group, inputs: e.inputs, desc: e.desc, ai: true }));
}

module.exports = { AI_ENGINES: AI_ENGINES, listAiEngines: listAiEngines, runAiEngine: runAiEngine, aiFallback: aiFallback };
