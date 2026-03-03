import { initFavicon } from './favicon.js';
import { initGrid }    from './grid.js';
import { initModal }   from './modal.js';
import { flashCopy }   from './clipboard.js';

initFavicon();
initGrid();
initModal();

// Install bar copy button
document.getElementById('bar-copy').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('cmd-text').textContent).catch(() => {});
  flashCopy(document.getElementById('bar-copy'));
});

// Loading screen
window.addEventListener('load', () => {
  const screen = document.getElementById('loading-screen');
  screen.classList.add('fade-out');
  screen.addEventListener('transitionend', () => screen.remove(), { once: true });
});
