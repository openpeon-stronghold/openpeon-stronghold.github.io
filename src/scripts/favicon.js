export function initFavicon() {
  const FRAMES = 29, FW = 32, FPS = 10;

  const favCanvas = document.createElement('canvas');
  favCanvas.width = favCanvas.height = 32;
  const favCtx = favCanvas.getContext('2d');

  const link = document.getElementById('favicon');

  const sprite = new Image();
  sprite.src   = 'assets/cursor/jester-sprite.webp';

  let frame = 0, last = 0;

  function tick(ts) {
    if (ts - last > 1000 / FPS) {
      favCtx.clearRect(0, 0, 32, 32);
      favCtx.drawImage(sprite, frame * FW, 0, FW, 32, 0, 0, 32, 32);
      link.href = favCanvas.toDataURL();

      frame = (frame + 1) % FRAMES;
      last  = ts;
    }
    requestAnimationFrame(tick);
  }
  sprite.onload = () => requestAnimationFrame(tick);
}
