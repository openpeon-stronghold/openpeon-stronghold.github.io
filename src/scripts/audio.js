let currentAudio   = null;
let currentPlayBtn = null;

function cleanup(btn) {
  if (btn) btn.classList.remove('playing');
  currentAudio   = null;
  currentPlayBtn = null;
}

export function playSound(btn, url) {
  if (currentAudio) {
    const isSame = currentPlayBtn === btn;
    currentAudio.pause();
    currentAudio.currentTime = 0;
    cleanup(currentPlayBtn);
    if (isSame) return; // toggle off
  }

  const audio = new Audio(url);
  btn.classList.add('playing');
  currentAudio   = audio;
  currentPlayBtn = btn;

  audio.addEventListener('ended', () => cleanup(btn));
  audio.addEventListener('error', () => cleanup(btn));
  audio.play().catch(() => cleanup(btn));
}

export function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    cleanup(currentPlayBtn);
  }
}
