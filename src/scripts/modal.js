import { playSound, stopAudio } from './audio.js';
import { CAT_LABELS } from './lords.js';
import { flashCopy } from './clipboard.js';

// Lucide icon paths (MIT, lucide.dev)
const CAT_ICONS = {
  'session.start':    `<path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>`,
  'task.acknowledge': `<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>`,
  'task.complete':    `<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>`,
  'task.error':       `<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>`,
  'input.required':   `<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>`,
  'resource.limit':   `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,
  'user.spam':        `<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>`,
};

function lucide(key) {
  const inner = CAT_ICONS[key] || `<circle cx="12" cy="12" r="10"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

// Briefing background animation
const BRIEFING_FRAMES = 13;
const BRIEFING_FPS    = 5;
const briefingUrls    = Array.from({ length: BRIEFING_FRAMES },
  (_, i) => `assets/images/modal-frame-${String(i).padStart(2,'0')}.webp`);

let bgFrame             = 0;
let bgInterval          = null;
let briefingLoadPromise = null;

function ensureBriefingLoaded() {
  if (!briefingLoadPromise) {
    briefingLoadPromise = Promise.all(
      briefingUrls.map(src => new Promise(resolve => {
        const img = new Image();
        img.onload  = resolve;
        img.onerror = resolve;
        img.src = src;
      }))
    );
  }
  return briefingLoadPromise;
}

function startBgAnimation() {
  const anim = document.getElementById('modal-bg-anim');
  anim.style.backgroundImage = `url('${briefingUrls[0]}')`;
  bgFrame = 0;
  ensureBriefingLoaded().then(() => {
    if (!document.getElementById('modal-backdrop').classList.contains('open')) return;
    bgInterval = setInterval(() => {
      bgFrame = (bgFrame + 1) % BRIEFING_FRAMES;
      anim.style.backgroundImage = `url('${briefingUrls[bgFrame]}')`;
    }, 1000 / BRIEFING_FPS);
  });
}

function stopBgAnimation() {
  clearInterval(bgInterval);
  bgInterval = null;
  const anim = document.getElementById('modal-bg-anim');
  if (anim) anim.style.backgroundImage = '';
}

// Manifest (local, fast)
const manifestCache = new Map();

export async function getManifest(slug) {
  if (manifestCache.has(slug)) return manifestCache.get(slug);
  const res = await fetch(`assets/packs/${slug}/openpeon.json`);
  if (!res.ok) throw new Error('not found');
  const data = await res.json();
  manifestCache.set(slug, data);
  return data;
}

function buildSoundList(slug, manifest) {
  const container = document.createDocumentFragment();
  for (const [catKey, catData] of Object.entries(manifest.categories || {})) {
    const meta = CAT_LABELS[catKey] || { label: catKey };
    const div  = document.createElement('div');
    div.className = 'modal-category';
    div.innerHTML = `<div class="modal-cat-label">${lucide(catKey)} ${meta.label}</div>
                     <div class="modal-sounds"></div>`;
    const soundsEl = div.querySelector('.modal-sounds');
    for (const sound of catData.sounds || []) {
      const row = document.createElement('div');
      row.className = 'sound-row';
      const btn = document.createElement('button');
      btn.className = 'play-btn';
      btn.title     = sound.label;
      const url     = `assets/packs/${slug}/${sound.file}`;
      btn.addEventListener('click', e => { e.stopPropagation(); playSound(btn, url); });
      const lbl = document.createElement('span');
      lbl.className   = 'sound-label';
      lbl.textContent = sound.label;
      row.append(btn, lbl);
      soundsEl.appendChild(row);
    }
    container.appendChild(div);
  }
  return container;
}

export async function openModal(slug, display, frameBg) {
  const packName    = slug;
  const portraitUrl = `https://raw.githubusercontent.com/openpeon-stronghold/${slug}/v1.1.0/icon.png`;
  const ghUrl       = `https://github.com/openpeon-stronghold/${slug}`;

  // Clone the Nunjucks-defined template
  const frag = document.getElementById('modal-tpl').content.cloneNode(true);
  frag.querySelector('.portrait-bg').style.backgroundImage = `url('${frameBg}')`;
  frag.querySelector('.modal-portrait-img').src = portraitUrl;
  frag.querySelector('.modal-portrait-img').alt = display;
  frag.querySelector('.modal-lord-name').textContent = display;
  frag.querySelector('.modal-slug').textContent = packName;
  frag.querySelector('.modal-cmd-text').textContent = `peon packs install ${packName}`;
  frag.querySelector('.modal-gh').href = ghUrl;

  const body = document.getElementById('modal-body');
  body.innerHTML = '';
  body.appendChild(frag);

  // Update install bar
  document.getElementById('cmd-text').textContent = `peon packs install ${packName}`;

  // Copy button (must query after append since frag is consumed)
  body.querySelector('.modal-copy-btn').addEventListener('click', () => {
    const btn = body.querySelector('.modal-copy-btn');
    navigator.clipboard.writeText(body.querySelector('.modal-cmd-text').textContent).catch(() => {});
    flashCopy(btn);
  });

  document.getElementById('modal-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  startBgAnimation();

  // Fetch local manifest — no loading state, it's instant
  try {
    const manifest = await getManifest(slug);
    const section  = body.querySelector('.modal-sounds-section');
    if (section) section.appendChild(buildSoundList(slug, manifest));
  } catch {
    const section = body.querySelector('.modal-sounds-section');
    if (section) section.innerHTML = '<div class="modal-error">Sounds coming soon.</div>';
  }
}

export function closeModal() {
  stopBgAnimation();
  stopAudio();
  document.getElementById('modal-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

export function initModal() {
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.getElementById('modal-backdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-backdrop')) closeModal();
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
}
