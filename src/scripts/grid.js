import { openModal, getManifest } from './modal.js';
import { playSound } from './audio.js';

export function initGrid() {
  const cards = [...document.querySelectorAll('.carousel-card[data-slug]')];
  if (!cards.length) return;

  let current = 0;
  const total = cards.length;

  function wrap(i) {
    return ((i % total) + total) % total;
  }

  function update() {
    const half = Math.floor(total / 2);
    cards.forEach((card, i) => {
      const pos = ((i - current + total + half) % total) - half;
      card.dataset.pos = String(pos);
    });
    const slug = cards[current].dataset.slug;
    document.getElementById('cmd-text').textContent = `peon packs install ${slug}`;
  }

  update();

  document.getElementById('carousel-prev').addEventListener('click', () => {
    current = wrap(current - 1);
    update();
  });

  document.getElementById('carousel-next').addEventListener('click', () => {
    current = wrap(current + 1);
    update();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { current = wrap(current - 1); update(); }
    if (e.key === 'ArrowRight') { current = wrap(current + 1); update(); }
  });

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (Number(card.dataset.pos) === 0) {
        const { slug, display, frameBg } = card.dataset;
        openModal(slug, display, frameBg);
      } else {
        current = i;
        update();
      }
    });

    const previewBtn = card.querySelector('.card-preview-btn');
    if (!previewBtn) return;
    previewBtn.addEventListener('click', async e => {
      e.stopPropagation();
      const { slug } = card.dataset;
      try {
        const manifest = await getManifest(slug);
        const sounds = Object.values(manifest.categories || {}).flatMap(c => c.sounds);
        if (sounds.length) {
          const sound = sounds[Math.floor(Math.random() * sounds.length)];
          playSound(previewBtn, `assets/packs/${slug}/${sound.file}`);
        }
      } catch {}
    });
  });
}
