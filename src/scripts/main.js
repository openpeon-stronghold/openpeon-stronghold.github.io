import { initFavicon } from './favicon.js';
import { initGrid }    from './grid.js';
import { initModal }   from './modal.js';

initFavicon();
initGrid();
initModal();

// Install bar copy button
document.getElementById('bar-copy').addEventListener('click', () => {
  const text = document.getElementById('cmd-text').textContent;
  navigator.clipboard.writeText(text).catch(() => {});
  const btn = document.getElementById('bar-copy');
  btn.classList.add('flash');
  setTimeout(() => btn.classList.remove('flash'), 350);
});

// Loading screen
window.addEventListener('load', () => {
  const screen = document.getElementById('loading-screen');
  screen.classList.add('fade-out');
  screen.addEventListener('transitionend', () => screen.remove(), { once: true });
});
