import { openModal } from './modal.js';

export function initGrid() {
  document.querySelectorAll('.card[data-slug]').forEach(card => {
    card.addEventListener('click', () => {
      const { slug, display, frameBg } = card.dataset;
      openModal(slug, display, frameBg);
    });
  });
}
