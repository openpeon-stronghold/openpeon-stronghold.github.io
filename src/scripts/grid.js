import { openModal, getManifest } from './modal.js';
import { playSound } from './audio.js';

export function initGrid() {
  document.querySelectorAll('.card[data-slug]').forEach(card => {
    card.addEventListener('click', () => {
      const { slug, display, frameBg } = card.dataset;
      openModal(slug, display, frameBg);
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
