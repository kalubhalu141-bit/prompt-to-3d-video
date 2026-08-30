// ∞ Power Engines — LLM-backed (Ollama local, free) with rules fallback.
// Appended additively to the 48 deterministic engines. Zero paid keys.
'use strict';
const { ENGINES, runEngine } = require('./server-engines');
const moodOf = t => /epic|galaxy|space|battle|action|explos|war/i.test(t) ? 'epic'
  : /calm|ocean|sunrise|relax|peace|meditat/i.test(t) ? 'calm'
  : /neon|cyber|night|synth|futur|hacker/i.test(t) ? 'neon'
  : /dark|noir|horror|myst|shadow|crime/i.test(t) ? 'dark'
  : /happy|joy|family|warm|heart|food|travel/i.test(t) ? 'warm' : 'balanced';

// ---- new engine registry (LLM-first, deterministic fallback) ----
const POWER_ENGINES = [
  { key: 'viral', label: '🚀 Viral Predictor', group: 'Strategy', inputs: [['title', 'Video title…', ''], ['platform', 'Platform', 'youtube']], desc: 'Score viral potential + concrete fixes' },
  { key: 'repurpose', label: '♻️ Repurpose Engine', group: 'Publish', inputs: [['prompt', 'Video / transcript…', '']], desc: 'Turn one video into 8 platform-native posts' },
  { key: 'thumbnailtext', label: '🅰️ Thumbnail Text', group: 'Publish', inputs: [['topic', 'Topic…', '']], desc: '3-word overlay text + layout plan' },
  { key: 'retention', label: '📉 Retention Doctor', group: 'Strategy', inputs: [['prompt', 'Describe your video + where viewers drop…', '']], desc: 'Diagnose drop-off + re-hook plan' },
  { key: 'ads', label: '📢 Ad Script', group: 'Business', inputs: [['prompt', 'Product / offer…', ''], ['duration', 'Seconds', '30']], desc: '30s ad script: hook, proof, offer, CTA' },
  { key: 'multilang', label: '🌍 Multi-Language Kit', group: 'Publish', inputs: [['prompt', 'Title + description…', '']], desc: 'Localize metadata for 6 major languages' },
  { key: 'competitor', label: '🕵️ Competitor Teardown', group: 'Strategy', inputs: [['topic', 'Niche / channel…', '']], desc: 'Content-gap analysis + attack angles' },
  { key: 'bts', label: '🎬 Production Prompt Pack', group: 'Directing', inputs: [['prompt', 'Video idea…', ''], ['shots', 'Shots', '6']], desc: 'Ready-to-paste AI video/image prompts per shot' },
  { key: 'musicbrief', label: '🎵 AI Music Brief', group: 'Audio', inputs: [['prompt', 'Video mood / topic…', '']], desc: 'AI music-generation prompt (Suno/UDIO style) + free alternatives' },
  { key: 'captionstyle', label: '💬 Caption Engineer', group: 'Production', inputs: [['prompt', 'Paste your script…', '']], desc: 'Chunk script into punchy word-timed caption cards' },
  { key: 'abtest', label: '🧪 A/B Test Designer', group: 'Strategy', inputs: [['title', 'Your video title…', '']], desc: '3 thumbnail/title A-B variants + what each tests' },
  { key: 'community', label: '📣 Community Post Kit', group: 'Community', inputs: [['topic', 'Channel / niche…', '']], desc: 'Poll, quiz, milestone + behind-the-scenes post drafts' },
  { key: 'emailpr', label: '✉️ Email & PR Pitch', group: 'Business', inputs: [['topic', 'What you made…', '']], desc: 'Newsletter blurb + press pitch with subject lines' },
  { key: 'remix', label: '🔀 Format Remixer', group: 'Scripting', inputs: [['prompt', 'Your video idea…', '']], desc: 'Same idea in 6 viral formats (listicle, POV, duet…)' }
];

function listPowerEngines() {
  return POWER_ENGINES.map(e => ({ key: e.key, label: e.label, group: e.group, inputs: e.inputs, desc: e.desc, power: true }));
}

// deterministic fallbacks (never broken offline)
function powerFallback(key, input) {
  const t = String(input.prompt || input.title || input.topic || '');
  switch (key) {
    case 'viral': {
      const len = t.length; const hasNum = /\d/.test(t); const hasQ = /[?]/.test(t);
      let score = 45 + (len >= 25 && len <= 60 ? 20 : 0) + (hasNum ? 15 : 0) + (hasQ ? 10 : 0) + (/(secret|nobody|stop|why|how|mistake)/i.test(t) ? 10 : 0);
      return { score: Math.min(98, score) + '/100', verdict: score >= 75 ? 'Strong viral shape' : 'Needs a sharper curiosity gap', fixes: ['Front-load the payoff', 'Add a number or timeframe', 'Test 2 thumbnails with different emotions'] };
    }
    case 'repurpose':
      return { posts: ['YouTube Short: 45s cut of the best 3 moments', 'TikTok: hook-first 30s with on-screen captions', 'Instagram Reel: 20s visual summary + trending audio', 'LinkedIn: 150-word insight post + link', 'X/Twitter thread: 6 tweets, one takeaway each', 'Pinterest: quote card from best line', 'Blog/SEO: 600-word expanded how-to', 'Newsletter: 3-bullet summary + video embed'] };
    case 'thumbnailtext':
      return { texts: ['IT WORKS', 'BIG MISTAKE', '$0 SETUP'], layout: 'text left third, face right third, high contrast outline, yellow/white only' };
    case 'retention':
      return { diagnosis: 'Most drop-off happens at the setup — viewers leave before the payoff.', fixes: ['Move your best moment to 0-5s', 'Cut the intro to one sentence', 'Add a visual change every 4s', 'Tease the payoff at the 30% mark'] };
    case 'ads': {
      const d = parseInt(input.duration) || 30;
      return { script: ['0-3s HOOK: problem in one line', '3-10s AGITATE: what it costs to ignore', '10-20s PROOF: demo + one number', '20-27s OFFER: ' + t, '27-30s CTA: single action'], note: d + 's cut' };
    }
    case 'multilang':
      return { languages: ['es', 'hi', 'pt', 'fr', 'de', 'ja'], note: 'Server translates via MyMemory (free) — see /api/translate', tip: 'Localize title + first 2 lines of description only' };
    case 'competitor':
      return { angles: ['Beginner path they skip', 'Myth-busting their top advice', 'Speed: their 20min topic in 5', 'Cost breakdown they hide', 'Failure cases they never show'], gaps: 'Long-form deep dives + Shorts pairing is the usual gap' };
    case 'bts': {
      const shots = Math.max(2, Math.min(10, parseInt(input.shots) || 6));
      const styles = ['cinematic wide shot, golden hour, 35mm', 'macro detail, shallow depth of field', 'aerial drone reveal, sunrise', 'handheld follow shot, natural light', 'slow motion 120fps, dramatic backlight', 'timelapse, static tripod, clouds'];
      return { prompts: Array.from({ length: shots }, (_, i) => 'Shot ' + (i + 1) + ': ' + t + ' — ' + styles[i % styles.length] + ', 16:9, photorealistic') };
    }
    case 'musicbrief': {
      const m2 = moodOf(t);
      const map = { epic: ['epic orchestral trailer, hybrid choir, taiko hits', 110], calm: ['ambient lo-fi, soft pads, vinyl warmth', 75], neon: ['synthwave, gated reverb drums, analog arps', 104], dark: ['dark drone, sub bass, dissonant textures', 60], warm: ['upbeat acoustic pop, claps, ukulele', 116], balanced: ['corporate ambient, clean guitar, soft beat', 96] };
      const [style, bpm] = map[m2] || map.balanced;
      return { style, bpm: bpm + ' BPM', sunoPrompt: '[Instrumental] ' + style + ' for a video about ' + t + ' — build from minimal to full over 30s, end on a resolved chord', alternatives: ['Pixabay Music (free, no key): pixabay.com/music', 'Free Music Archive: freemusicarchive.org', 'YouTube Audio Library (free)'] };
    }
    case 'captionstyle': {
      const words = t.split(/\s+/).filter(Boolean);
      const cards = [];
      const per = Math.max(2, Math.min(4, Math.round(words.length / 8) || 3));
      for (let i = 0; i < Math.min(10, Math.ceil(words.length / per)); i++) {
        const chunk = words.slice(i * per, (i + 1) * per).join(' ');
        if (chunk) cards.push({ card: i + 1, text: chunk.toUpperCase().slice(0, 42), style: i === 0 ? 'yellow pop-in' : 'white center-bottom' });
      }
      return { cards, tip: 'One card per breath — max 4 words on screen at once' };
    }
    case 'abtest':
      return { variants: [{ v: 'A — Question hook', title: 'Why does nobody talk about this?', tests: 'curiosity gap' }, { v: 'B — Number promise', title: '5 things I wish I knew earlier', tests: 'specificity + list appeal' }, { v: 'C — Negative warning', title: 'Stop doing this immediately', tests: 'loss aversion' } ], note: 'Run A vs B for 48h with identical thumbnails before judging' };
    case 'community':
      return { posts: ['📊 POLL: "What should I cover next?" — option A: ' + t + ' deep-dive, B: beginner guide, C: tools comparison', '❓ QUIZ: "Only 10% get this right — what year did ' + t + ' blow up?"', '🎉 MILESTONE: "Thanks for X subscribers! Here is the story behind the channel"', '🎬 BTS: photo of your setup + one editing trick you used this week'] };
    case 'emailpr': {
      const s1 = 'The free tool that changes how you make videos';
      const s2 = 'I made ' + t.slice(0, 40) + ' — in 30 seconds';
      return { subjectLines: [s1, s2, 'No budget. No camera. No problem.'], newsletter: t + ' — this week I break down exactly how it works, step by step, with everything linked below.', prPitch: 'Hi [editor] — I built something your readers who care about ' + t.slice(0, 30) + ' will want to see. 2-minute demo video attached. Happy to do an exclusive.' };
    }
    case 'remix':
      return { formats: ['📋 Listicle: "' + t + '" as 5 ranked items with countdown', '🎥 POV: film it first-person, single take, text overlays', '🤝 Duet/Stitch: react to the most popular take on ' + t, '⏩ Speedrun: full idea compressed into 45s with jump cuts', '📖 Story mode: tell it as a personal failure-to-win arc', '🔇 Silent: music-only cut with bold captions doing the talking'] };
    default: return { error: 'unknown power engine' };
  }
}

async function runPowerEngine(key, input, llmFn) {
  const e = POWER_ENGINES.find(x => x.key === key);
  if (!e) return { error: 'unknown power engine: ' + key };
  const promptFor = {
    viral: 'Rate the viral potential of this video title for ' + (input.platform || 'youtube') + ' and give 3 concrete fixes. Title: "' + input.title + '". Reply with: SCORE n/100, one-line verdict, then fixes as a list.',
    repurpose: 'Turn this video into 8 platform-native repurposed posts (YouTube Short, TikTok, IG Reel, LinkedIn, X thread, Pinterest, blog, newsletter). Video: "' + input.prompt + '". Be specific per platform.',
    thumbnailtext: 'Give 3 options of 3-word max thumbnail overlay text for a video about "' + input.topic + '", plus a one-line layout plan. Uppercase, curiosity-driven.',
    retention: 'Diagnose viewer retention for this video and give 4 fixes. Video: "' + input.prompt + '".',
    ads: 'Write a ' + (input.duration || 30) + 's ad script for: ' + input.prompt + '. Structure: HOOK (0-3s), AGITATE, PROOF, OFFER, CTA. Punchy, spoken-word.',
    multilang: 'Localize this video metadata for Spanish, Hindi, Portuguese, French, German, Japanese — give the translated title + one-line description each. Source: "' + input.prompt + '"',
    competitor: 'Do a content-gap teardown of the niche "' + input.topic + '": 5 underserved angles and the biggest format gap.',
    bts: 'Break "' + input.prompt + '" into ' + (input.shots || 6) + ' shots. For each: a ready-to-paste text-to-video/image prompt (camera, light, lens, mood).',
    musicbrief: 'Write a music-generation prompt for an AI music tool for a video about: ' + input.prompt + '. Give style tags, BPM, structure, and one Suno-style bracketed prompt line.',
    captionstyle: 'Split this script into punchy on-screen caption cards, max 4 words each, in order. Script: ' + input.prompt,
    abtest: 'Design 3 A/B test variants (title + thumbnail concept) for this video and say what psychological trigger each tests. Title: "' + input.title + '"',
    community: 'Draft 4 community-tab posts (poll, quiz, milestone, behind-the-scenes) for a channel about: ' + input.topic,
    emailpr: 'Write 3 email subject lines, a short newsletter blurb, and a press pitch for: ' + input.topic,
    remix: 'Reimagine this video idea in 6 different viral formats (listicle, POV single-take, duet/stitch reaction, 45s speedrun, personal story arc, silent captions-only). Idea: ' + input.prompt
  }[key];
  let llm = null;
  if (llmFn) llm = await llmFn('You are an elite video growth strategist. Be specific, no filler.', promptFor, 90000);
  const result = powerFallback(key, input);
  return {
    engine: llm ? 'llm' : 'rules', key, _label: e.label,
    _mode: llm ? 'free local LLM (Ollama)' : 'deterministic free AI (rule-based, no key)',
    input, result, llm: llm ? llm.text : undefined
  };
}

module.exports = { POWER_ENGINES, listPowerEngines, runPowerEngine, powerFallback };
