// ∞ Infinity Video Generator — full API server (zero-dep, free AI only)
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { ENGINES, runEngine, listEngines } = require('./server-engines');
const { listPowerEngines, runPowerEngine } = require('./server-power');

const PUBLIC_DIR = path.join(__dirname, 'public');
const POWER_KEYS = new Set(['viral', 'repurpose', 'thumbnailtext', 'retention', 'ads', 'multilang', 'competitor', 'bts', 'musicbrief', 'captionstyle', 'abtest', 'community', 'emailpr', 'remix']);
const PORT = process.env.PORT || 3000;
const GH_TOKEN_FILE = path.join(process.env.USERPROFILE || process.env.HOME || '', '.gh_token');
let GH_TOKEN = '';
try { GH_TOKEN = fs.readFileSync(GH_TOKEN_FILE, 'utf8').trim(); } catch (e) {}

// ---------- helpers ----------
function sendJSON(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve) => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 5e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch (e) { resolve({}); } });
  });
}
async function fetchJSON(url, opts = {}, timeoutMs = 15000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...opts, signal: ac.signal });
    const ct = r.headers.get('content-type') || '';
    if (!ct.includes('json')) return { _status: r.status, text: await r.text() };
    const j = await r.json();
    return Array.isArray(j) ? j : { _status: r.status, ...j };
  } catch (e) { return { _error: e.message }; }
  finally { clearTimeout(t); }
}
const ghHeaders = () => ({
  'User-Agent': 'infinity-video-generator',
  'Accept': 'application/vnd.github+json',
  ...(GH_TOKEN ? { 'Authorization': 'Bearer ' + GH_TOKEN } : {})
});
function ghUnauth() {
  // retry without token on failure
  return !GH_TOKEN;
}
function moodOf(t) {
  t = String(t || '');
  if (/epic|galaxy|space|battle|action|explos|war/i.test(t)) return 'epic';
  if (/calm|ocean|sunrise|relax|peace|meditat/i.test(t)) return 'calm';
  if (/neon|cyber|night|synth|futur|hacker/i.test(t)) return 'neon';
  if (/dark|noir|horror|myst|shadow|crime/i.test(t)) return 'dark';
  if (/happy|joy|family|warm|heart|food|travel/i.test(t)) return 'warm';
  return 'balanced';
}

// ---------- LLM chain: Ollama → rules fallback (free, no key) ----------
const OLLAMA = 'http://localhost:11434';
let ollamaCache = { ok: false, models: [], at: 0 };
async function ollamaStatus(force) {
  if (!force && Date.now() - ollamaCache.at < 10000) return ollamaCache;
  const j = await fetchJSON(OLLAMA + '/api/tags', {}, 3000).catch(() => ({ _error: 'down' }));
  ollamaCache = j.models ? { ok: true, models: j.models.map(m => m.name), at: Date.now() } : { ok: false, models: [], at: Date.now() };
  return ollamaCache;
}
async function callOllama(sys, q, timeoutMs = 120000, forcedModel = null) {
  const st = await ollamaStatus();
  if (!st.ok) return null;
  const model = forcedModel && st.models.includes(forcedModel) ? forcedModel
    : (st.models.find(m => /llama3/.test(m)) || st.models.find(m => !/cloud/.test(m)) || st.models[0]);
  if (!model) return null;
  try {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    const started = Date.now();
    const r = await fetch(OLLAMA + '/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, stream: false, keep_alive: '30m',
        messages: [{ role: 'system', content: sys }, { role: 'user', content: q }] }),
      signal: ac.signal
    });
    clearTimeout(timer);
    if (!r.ok) return null;
    const j = await r.json();
    const text = j.message && j.message.content;
    return text ? { text, engine: 'ollama:' + model } : null;
  } catch (e) { return null; }
}

// deterministic rules fallback so copilot never dies
function rulesAnswer(q) {
  const t = String(q || '').slice(0, 200);
  const m = moodOf(t);
  if (/\bscript\b/i.test(q)) return { text: 'Here is a quick script outline for "' + t + '":\n1. Hook (0-3s): open with the most surprising fact.\n2. Setup (3-10s): state the problem.\n3. Build (10-20s): show the method in action.\n4. Payoff (20-27s): results / before-after.\n5. CTA (27-30s): one clear next step.', engine: 'rules' };
  if (/title/i.test(q)) return { text: ['How to Master ' + t + ' in 2026', t + ' — The Complete Guide', 'I Tried ' + t + ' for 30 Days', '5 ' + t + ' Mistakes to Avoid', 'Why Nobody Talks About ' + t].join('\n'), engine: 'rules' };
  if (/hashtag|tag/i.test(q)) return { text: '#' + String(t).toLowerCase().replace(/[^a-z0-9]/g, '') + ' #shorts #viral #ai #video #trending #creator #howto #tutorial #content', engine: 'rules' };
  return { text: 'Copilot (offline rules mode): for "' + t + '" I suggest a ' + m + '-mood treatment — start with a 3s hook, one idea per beat, and end with a single CTA. Start Ollama locally for full LLM answers.', engine: 'rules' };
}

// ---------- static serving ----------
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain', '.mjs': 'text/javascript' };
function serveStatic(req, res, pathname) {
  try {
    if (pathname.includes('..')) { res.writeHead(403); res.end('Forbidden'); return; }
    const filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
    if (!path.resolve(filePath).startsWith(path.resolve(PUBLIC_DIR))) { res.writeHead(403); res.end('Forbidden'); return; }
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) { res.writeHead(404); res.end('Not found'); return; }
      fs.readFile(filePath, (err2, data) => {
        if (err2) { res.writeHead(500); res.end('ISE'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
        res.end(data);
      });
    });
  } catch (e) { res.writeHead(500); res.end('ISE'); }
}

// ---------- API routes ----------
async function handleApi(req, res, url) {
  const p = url.pathname;
  const q = Object.fromEntries(url.searchParams);

  if (p === '/api/health') {
    const ol = await ollamaStatus();
    return sendJSON(res, 200, { ok: true, app: 'infinity-video-generator', engines: ENGINES.length + listPowerEngines().length, ollama: ol.ok, ollamaModels: ol.models, ghToken: !!GH_TOKEN, port: PORT });
  }

  // ---- engines ----
  if (p === '/api/engines') return sendJSON(res, 200, { engines: [...listEngines(), ...listPowerEngines()], count: ENGINES.length + listPowerEngines().length, total: ENGINES.length + listPowerEngines().length });
  if (p === '/api/engine/run' && POWER_KEYS.has(q.key)) {
    const input = {};
    for (const [k, v] of Object.entries(q)) if (k.startsWith('in_')) input[k.slice(3)] = v;
    const out = await runPowerEngine(q.key, input, callOllama);
    return sendJSON(res, 200, out);
  }
  if (p === '/api/engine/run') {
    const input = {};
    for (const [k, v] of Object.entries(q)) if (k.startsWith('in_')) input[k.slice(3)] = v;
    // optional LLM enhancement when llm=1 and Ollama alive
    let enhanced = null;
    if (q.llm === '1') {
      enhanced = await callOllama('You are a video production assistant. Answer concisely.', JSON.stringify(input));
    }
    const out = runEngine(q.key, input);
    if (enhanced && enhanced.text) { out.llm = enhanced.text; out._mode += ' + LLM'; }
    return sendJSON(res, 200, out);
  }

  // ---- image generation (Pollinations Flux, keyless) ----
  if (p === '/api/aigen') {
    const prompt = q.prompt || 'abstract cinematic gradient';
    const w = Math.min(1280, parseInt(q.w) || 640), h = Math.min(1280, parseInt(q.h) || 360);
    const model = q.model || 'flux';
    const seed = q.seed || Math.floor(Math.random() * 999999);
    const u = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=' + w + '&height=' + h + '&model=' + model + '&seed=' + seed + '&nologo=true';
    return sendJSON(res, 200, { ok: true, url: u, model, seed });
  }

  // ---- TTS via Google translate voice endpoint ----
  if (p === '/api/tts') {
    const text = String(q.q || '').slice(0, 180);
    const tl = q.tl || 'en';
    return sendJSON(res, 200, { ok: true, url: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + encodeURIComponent(tl) + '&q=' + encodeURIComponent(text) });
  }

  // ---- stock libraries (keyless) ----
  if (p === '/api/commons') {
    const sr = await fetchJSON('https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=' + (parseInt(q.n) || 12) + '&srsearch=' + encodeURIComponent(q.q || ''));
    const titles = (((sr.query || {}).search) || []).map(r => r.title);
    let items = [];
    if (titles.length) {
      const ij = await fetchJSON('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=400&origin=*&titles=' + encodeURIComponent(titles.join('|')));
      const pages = ij.query && ij.query.pages ? Object.values(ij.query.pages) : [];
      items = pages.map(pg => { const ii = pg.imageinfo && pg.imageinfo[0]; return ii ? { title: pg.title, thumb: ii.thumburl, url: ii.url } : null; }).filter(Boolean);
    }
    return sendJSON(res, 200, { items });
  }
  if (p === '/api/openverse') {
    const j = await fetchJSON('https://api.openverse.org/v1/images/?q=' + encodeURIComponent(q.q || '') + '&page_size=' + (parseInt(q.n) || 18));
    return sendJSON(res, 200, { items: (j.results || []).map(r => ({ title: r.title, thumb: r.thumbnail, url: r.url, license: r.license })) });
  }
  if (p === '/api/archive') {
    const j = await fetchJSON('https://archive.org/advancedsearch.php?q=' + encodeURIComponent(q.q || '') + '&fl[]=identifier&fl[]=title&rows=' + (parseInt(q.n) || 15) + '&output=json');
    const docs = j.response && j.response.docs || [];
    return sendJSON(res, 200, { items: docs.map(d => ({ id: d.identifier, title: d.title, thumb: 'https://archive.org/services/img/' + d.identifier, url: 'https://archive.org/details/' + d.identifier })) });
  }

  // ---- LLM copilot ----
  if (p === '/api/llm/status') {
    const ol = await ollamaStatus(true);
    return sendJSON(res, 200, { ollama: ol.ok, ollamaModels: ol.models, ollamaModel: ol.models.find(m => /llama3/.test(m)) || ol.models[0] || '', hf: false, rules: true });
  }
  if (p === '/api/llm') {
    const sys = q.sys || 'You are a helpful video production assistant.';
    let r = null;
    let engineTag = 'rules';
    // model-specific Ollama call (frontend model picker)
    if (!q.engine || q.engine === 'auto' || q.engine === 'ollama' || q.engine.startsWith('ollama:')) {
      const forced = q.engine && q.engine.startsWith('ollama:') ? q.engine.slice(7) : null;
      r = await callOllama(sys, q.q || '', 120000, forced);
      if (r) engineTag = r.engine; else engineTag = q.engine === 'ollama' ? 'ollama-unavailable→rules' : 'rules';
    }
    if (!r) r = rulesAnswer(q.q);
    return sendJSON(res, 200, { ok: true, ...r, content: r.text });
  }

  // ---- GitHub skills (keyless; higher rate with ~/.gh_token) ----
  if (p.startsWith('/api/github/')) {
    const sub = p.split('/')[3];
    if (sub === 'search') {
      const type = q.type || 'repositories';
      let endpoint;
      if (type === 'code') endpoint = 'https://api.github.com/search/code?q=' + encodeURIComponent(q.q || '');
      else if (type === 'users') endpoint = 'https://api.github.com/search/users?q=' + encodeURIComponent(q.q || '');
      else endpoint = 'https://api.github.com/search/repositories?q=' + encodeURIComponent(q.q || '') + '&sort=stars&per_page=15';
      let j = await fetchJSON(endpoint, { headers: ghHeaders() }, 20000);
      if ((j._status === 401 || j._status === 403) && GH_UNAUTH_FALLBACK) {}
      if (j._status && j._status >= 400) {
        // retry unauthenticated
        j = await fetchJSON(endpoint.replace(',{}', ''), { headers: { 'User-Agent': 'ivg', 'Accept': 'application/vnd.github+json' } }, 20000);
      }
      const items = j.items || [];
      return sendJSON(res, 200, { items: type === 'code' ? items.map(i => ({ name: i.path, repo: i.repository.full_name, url: i.html_url, ref: (i.repository.default_branch || 'main') })) : items.map(i => ({ name: i.full_name || i.login, stars: i.stargazers_count, desc: (i.description || '').slice(0, 120), url: i.html_url, lang: i.language, defaultBranch: i.default_branch || 'main' })), total: j.total_count || items.length });
    }
    if (sub === 'repo') {
      const repo = q.repo || '';
      const [info, readme] = await Promise.all([
        fetchJSON('https://api.github.com/repos/' + repo, { headers: ghHeaders() }),
        fetchJSON('https://api.github.com/repos/' + repo + '/readme', { headers: { ...ghHeaders(), 'Accept': 'application/vnd.github.raw' } })
      ]);
      let md = typeof readme.text === 'string' ? readme.text : (readme.content || '');
      if (typeof md !== 'string') md = '';
      return sendJSON(res, 200, { info: { name: info.full_name, stars: info.stargazers_count, forks: info.forks_count, issues: info.open_issues_count, lang: info.language, license: info.license && info.license.spdx_id, topics: info.topics, desc: info.description, branch: info.default_branch }, readme: md.slice(0, 8000) });
    }
    if (sub === 'file') {
      const j = await fetchJSON('https://raw.githubusercontent.com/' + q.repo + '/' + (q.ref || 'main') + '/' + (q.path || '').replace(/^\/+/, ''));
      return sendJSON(res, 200, typeof j.text === 'string' ? { content: j.text } : { content: '', error: 'not found or binary' });
    }
    if (sub === 'trending') {
      // trending approximation: recently pushed repos sorted by stars gained today is not public; use search by created/pushed date + stars
      const since = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
      const langQ = q.lang && q.lang !== 'any' ? '+language:' + encodeURIComponent(q.lang) : '';
      const j = await fetchJSON('https://api.github.com/search/repositories?q=created%3A%3E' + since + langQ + '&sort=stars&order=desc&per_page=15', { headers: ghHeaders() });
      return sendJSON(res, 200, { items: (j.items || []).map(i => ({ name: i.full_name, stars: i.stargazers_count, desc: (i.description || '').slice(0, 140), url: i.html_url, lang: i.language, defaultBranch: i.default_branch || 'main' })) });
    }
    if (sub === 'gist') {
      if (req.method !== 'POST') return sendJSON(res, 405, { error: 'POST only' });
      const body = await readBody(req);
      const tok = (body.token || '').trim();
      if (!tok) return sendJSON(res, 400, { error: 'GitHub token required (gist scope)' });
      const r = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: { 'User-Agent': 'ivg', 'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github+json' },
        body: JSON.stringify({ description: body.description || 'Infinity Video Generator project', public: false, files: { [(body.filename || 'project.md').replace(/[^\w.-]/g, '_')]: { content: body.content || '' } } })
      });
      const j = await r.json().catch(() => ({}));
      return sendJSON(res, r.ok ? 200 : j.message ? 401 : 500, { ok: r.ok, url: j.html_url, error: j.message });
    }
    if (sub === 'video') {
      // "repo → video pitch": summarize a repo as a video concept using rules + repo facts
      const repo = q.repo || '';
      const info = await fetchJSON('https://api.github.com/repos/' + repo, { headers: ghHeaders() });
      if (!info.full_name) return sendJSON(res, 200, { error: 'repo not found' });
      const m = moodOf(info.description || '');
      return sendJSON(res, 200, {
        repo: info.full_name,
        concept: { hook: 'This repo has ' + info.stargazers_count + ' stars — here\'s why.', beats: ['What it does: ' + (info.description || 'open-source project'), 'Show the README demo live', 'Star it & clone in 10 seconds'], mood: m, thumbnailPrompt: 'github repository ' + info.full_name + ', code on screen, ' + m + ' lighting, bold composition, no text' }
      });
    }
    return sendJSON(res, 404, { error: 'unknown github route' });
  }

  // ---- trends (keyless) ----
  if (p === '/api/trends') {
    const [hn, wiki] = await Promise.all([
      fetchJSON('https://hacker-news.firebaseio.com/v0/topstories.json').then(async top => {
        const ids = (Array.isArray(top) ? top : []).slice(0, 12);
        const items = await Promise.all(ids.map(id => fetchJSON('https://hacker-news.firebaseio.com/v0/item/' + id + '.json')));
        return items.filter(Boolean).map(i => ({ title: i.title, score: i.score, url: i.url || ('https://news.ycombinator.com/item?id=' + i.id) }));
      }),
      fetchJSON('https://api.wikimedia.org/feed/v1/wikipedia/en/featured/' + new Date(Date.now() - 864e5).toISOString().slice(0, 10).replace(/-/g, '/')).then(f => ((f.mostread && f.mostread.articles) || []).slice(0, 8).map(a => ({ title: a.titles && a.titles.normalized || a.title, views: a.views, url: a.content_urls && a.content_urls.desktop.page })))
    ]);
    return sendJSON(res, 200, { hn, wiki });
  }
  if (p === '/api/reddit') {
    const j = await fetchJSON('https://www.reddit.com/r/' + encodeURIComponent(q.sub || 'all') + '/top.json?t=' + (q.t || 'day') + '&limit=15', { headers: { 'User-Agent': 'ivg/1.0' } });
    const posts = (((j.data || {}).children) || []).map(c => ({ title: c.data.title, score: c.data.score, url: 'https://reddit.com' + c.data.permalink }));
    return sendJSON(res, 200, { posts });
  }

  // ---- translation (keyless MyMemory + Google fallback) ----
  if (p === '/api/translate') {
    const text = String(q.q || '').slice(0, 480);
    const tl = q.tl || 'es';
    const j = await fetchJSON('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=en|' + encodeURIComponent(tl));
    const t = j.responseData && j.responseData.translatedText;
    if (t) return sendJSON(res, 200, { ok: true, translation: t, engine: 'mymemory' });
    return sendJSON(res, 200, { ok: false, error: 'translation unavailable' });
  }

  // ---- infinite features feed (per-tab idea banks, endless via seed) ----
  if (p === '/api/infinite-features') {
    const page = q.page || 'ideas';
    const seed = parseInt(q.seed) || 1;
    const n = Math.min(24, parseInt(q.n) || 12);
    const X = ['AI video', 'drone shots', 'vlog editing', 'sound design', 'color grading', 'storyboarding', 'green screen', 'motion graphics', 'podcast clips', 'product ads', 'travel montage', 'cooking b-roll', 'unboxing', 'street interview', 'time-lapse city'];
    const E = { studio:'🎬', workbench:'🧠', image:'🎨', stock:'📚', copilot:'⚡', device:'📡', github:'🐙', trends:'🔥', lang:'🌐', tts:'🗣' };
    const B = {
      studio: ['one-take challenge: {x}', '{x} but every cut is a match cut', 'silent-film version of {x}', '{x} told entirely through screen recordings', 'reverse chronology {x}', '{x} in 60 seconds vs 60 minutes', '{x} as a fake documentary', 'day in the life: {x}', '{x} with zero voiceover — music only'],
      workbench: ['hook — write hooks for {x}', 'titles — 10 titles for {x}', 'broll — coverage for {x}', 'palette — colors for {x}', 'pacing — timing table for {x}', 'seo — score a {x} title', 'series — {x} mini-series', 'thumbnail — prompt for {x}'],
      image: ['cinematic still of {x}, golden hour, 35mm', '{x}, neon night, rain reflections, anamorphic', 'macro texture of {x}, shallow depth of field', 'aerial view of {x}, sunrise fog', '{x}, film noir lighting, black and white', 'isometric miniature diorama of {x}', '{x} poster art, bold typography space, no text'],
      stock: ['{x} wide establishing footage', '{x} close-up details', '{x} timelapse', '{x} slow motion', '{x} aerial drone clip', 'people interacting with {x}', '{x} textures and patterns'],
      copilot: ['Write a 30s script about {x}', 'Give me 5 viral hooks for {x}', 'Critique my {x} thumbnail plan', 'What gear do I need for {x}?', 'Turn {x} into a series concept', 'Write a sponsor pitch for a {x} channel'],
      device: ['summarize this {x} transcript', 'classify the mood of {x} clips', 'extract keywords from {x} notes', 'zero-shot sort {x} ideas by topic', 'answer questions from my {x} script'],
      github: ['open-source {x} tools', '{x} ffmpeg scripts', 'auto-editing bots for {x}', 'subtitle generators', 'stock footage APIs', '{x} starter templates', 'twitch clip to short converters'],
      trends: ['react to the top story about {x}', 'explainer: why {x} is trending', 'beginner guide riding the {x} wave', 'myth-busting {x} news', 'history of {x} and where it goes next'],
      lang: ['My video is about {x}. Subscribe!', 'In this video: {x}, explained simply.', 'New episode on {x} every Friday.', 'Links and resources about {x} below.'],
      tts: ['Welcome back! Today we dive into {x}.', 'Before we start — smash that subscribe button for more {x}.', 'Let\'s break down {x} step by step.', 'That was {x} in ninety seconds. See you next time.']
    };
    const bank = B[page] || B.studio;
    const items = Array.from({ length: n }, (_, i) => ({
      emoji: E[page] || '∞',
      title: bank[(seed + i) % bank.length].replace('{x}', X[(seed + i * 3) % X.length]),
      desc: 'seed ' + (seed + i) + ' · click to use'
    }));
    return sendJSON(res, 200, { page, items, nextSeed: seed + n });
  }

  // ---- NEW: Wikipedia topic research (real live data, keyless) ----
  if (p === '/api/wiki') {
    const topic = q.q || '';
    if (!topic) return sendJSON(res, 400, { error: 'q required' });
    const s = await fetchJSON('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(topic) + '&format=json&srlimit=3', { headers: { 'User-Agent': 'ivg' } }, 12000);
    const hits = (s.query && s.query.search) || [];
    const out = [];
    for (const h of hits.slice(0, 2)) {
      const sum = await fetchJSON('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(h.title), { headers: { 'User-Agent': 'ivg' } }, 12000);
      out.push({ title: h.title, url: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(h.title.replace(/ /g, '_')), extract: (sum.extract || '').slice(0, 600), thumb: sum.thumbnail && sum.thumbnail.source });
    }
    return sendJSON(res, 200, { ok: true, topic, results: out, videoAngles: ['The real history of ' + topic + ' nobody covers', 'What Wikipedia won\'t tell you about ' + topic, topic + ': myths vs facts (sourced)'] });
  }

  // ---- NEW: Google News RSS (real headlines, keyless) ----
  if (p === '/api/newsrss') {
    const topicQ = q.q ? encodeURIComponent(q.q) : '';
    const r = await fetch('https://news.google.com/rss/search?q=' + topicQ + '&hl=en-US&gl=US&ceid=US:en', { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) }).catch(() => null);
    if (!r || !r.ok) return sendJSON(res, 200, { ok: false, items: [], note: 'upstream unavailable' });
    const xml = await r.text();
    const items = [];
    const re = /<item><title>(.*?)<\/title><link>(.*?)<\/link>.*?<pubDate>(.*?)<\/pubDate>/gs;
    let m;
    while ((m = re.exec(xml)) && items.length < 12) {
      items.push({ title: m[1].replace(/&[^;]+;/g, '').replace(/ - [^-]+$/, ''), url: m[2], date: m[3].slice(0, 16) });
    }
    return sendJSON(res, 200, { ok: true, q: q.q || 'all', items });
  }

  // ---- NEW: free music finder (Internet Archive audio, keyless) ----
  if (p === '/api/music') {
    const genre = q.q || q.genre || 'cinematic';
    const j = await fetchJSON('https://archive.org/advancedsearch.php?q=' + encodeURIComponent('mediatype:(audio) AND ' + genre) + '&fl%5B%5D=identifier&fl%5B%5D=title&rows=10&page=1&output=json', {}, 20000);
    const docs = (j.response && j.response.docs) || [];
    return sendJSON(res, 200, { ok: true, genre, tracks: docs.map(d => ({ id: d.identifier, title: d.title, url: 'https://archive.org/details/' + d.identifier })) });
  }

  // ---- NEW: idea mashup generator (deterministic, endless) ----
  if (p === '/api/ideas') {
    const base = q.q || 'AI video';
    const seed = parseInt(q.seed) || Math.floor(Math.random() * 9999);
    const F = ['but every cut is a match cut', 'told in reverse', 'as a fake documentary', 'with zero voiceover — captions only', 'in one continuous take', 'as a silent-film parody', 'speedrun edition — 45 seconds', 'from the villain\'s perspective', 'shot entirely on a phone webcam', 'as a nature documentary narration'];
    const H = ['Nobody talks about this side of', 'I tried the impossible:', 'This changes everything about', 'The truth they hide about', 'Stop scrolling —'];
    const items = Array.from({ length: Math.min(20, parseInt(q.n) || 8) }, (_, i) => ({
      title: H[(seed + i) % H.length] + ' ' + base,
      format: F[(seed * 3 + i * 7) % F.length],
      hookTime: (i % 3 + 1) + 's',
      mood: ['epic', 'calm', 'neon', 'dark', 'warm'][(seed + i) % 5]
    }));
    return sendJSON(res, 200, { ok: true, base, items, nextSeed: seed + 1 });
  }

  // ---- NEW: full production script assembler (chains real engines) ----
  if (p === '/api/scriptfull') {
    const idea = q.idea || '';
    if (!idea) return sendJSON(res, 400, { error: 'idea required' });
    const dur = parseInt(q.duration) || 30;
    const plat = q.platform || 'youtube';
    const run = k => {
      const input = { prompt: idea, topic: idea, idea, duration: dur, platform: plat };
      const j = runEngine(k, input);
      return j.result || {};
    };
    const script = run('script'), vo = run('voiceover'), sb = run('storyboard'), pal = run('palette');
    const scenes = (sb.beats || []).map((b, i) => ({ scene: i + 1, action: b.action, camera: b.cam, duration: b.dur, narration: ((vo.script || '').split(/(?<=[.!?])\s+/)[i % 6] || '') }));
    return sendJSON(res, 200, {
      ok: true, idea, platform: plat, totalDuration: dur + 's',
      logline: idea.split(/[.!?]/)[0].trim(),
      scenes,
      colorPalette: pal.palette || [],
      fullScript: (vo.script || ''),
      beats: script.beats || []
    });
  }

  // ---- NEW: thumbnail forge — AI image with text-safe composition variants ----
  if (p === '/api/thumbnail') {
    const t = q.topic || '';
    if (!t) return sendJSON(res, 400, { error: 'topic required' });
    const seed = q.seed || Math.floor(Math.random() * 999999);
    const styles = [
      'shocked face reaction close-up, bold yellow background, high contrast',
      'split-screen before-after comparison, red arrows, dramatic lighting',
      'glowing product center frame, dark vignette, neon rim light'
    ];
    const i0 = parseInt(q.v) || 0;
    return sendJSON(res, 200, {
      ok: true, variants: styles.map((s, i) => ({
        v: i, label: ['Reaction', 'Comparison', 'Hero glow'][i],
        url: 'https://image.pollinations.ai/prompt/' + encodeURIComponent(t + ', ' + s + ', youtube thumbnail composition, 1280x720, no watermark') + '?width=1280&height=720&model=flux&nologo=true&seed=' + (Number(seed) + i)
      }))
    });
  }

  return sendJSON(res, 404, { error: 'API endpoint not found: ' + p });
}

// sloppy var used above — define properly
var GH_UNAUTH_FALLBACK = true;

function handleRequest(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      Promise.resolve(handleApi(req, res, url)).catch(e => {
        try { sendJSON(res, 500, { error: e.message }); } catch (_) {}
      });
      return;
    }
    serveStatic(req, res, decodeURIComponent(url.pathname));
  } catch (e) { try { res.writeHead(500); res.end('ISE'); } catch (_) {} }
}

if (require.main === module) {
  http.createServer(handleRequest).listen(PORT, () => {
    console.log('∞ Infinity Video Generator running at http://localhost:' + PORT);
    console.log('Engines: ' + ENGINES.length + ' · Ollama probe: ' + OLLAMA + ' · GH token: ' + (GH_TOKEN ? 'yes' : 'no'));
  });
}
module.exports = handleRequest;
