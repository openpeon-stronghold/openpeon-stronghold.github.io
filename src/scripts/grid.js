import { openModal, getManifest } from "./modal.js";
import { playSound } from "./audio.js";

export function initGrid() {
  const cards = [
    ...document.querySelectorAll(".carousel-card[data-slug]"),
  ];
  if (!cards.length) return;

  let current = 0;
  const total = cards.length;
  let wasDrag = false;

  function wrap(i) {
    return ((i % total) + total) % total;
  }

  const nameDisplay = document.getElementById("lord-name-display");
  const counter = document.getElementById("carousel-counter");

  function update() {
    const half = Math.floor(total / 2);
    cards.forEach((card, i) => {
      const pos = ((i - current + total + half) % total) - half;
      card.dataset.pos = String(pos);
    });
    const slug = cards[current].dataset.slug;
    const display = cards[current].dataset.display;
    document.getElementById("cmd-text").textContent =
      `peon packs install ${slug}`;
    counter.textContent = `${current + 1} / ${total}`;

    // Fade-update the lord name display
    nameDisplay.classList.remove("lord-name-visible");
    requestAnimationFrame(() => {
      nameDisplay.textContent = display;
      nameDisplay.classList.add("lord-name-visible");
    });
  }

  update();

  // Trigger entrance animation after first paint
  requestAnimationFrame(() => {
    document
      .querySelector(".carousel-section")
      .classList.add("carousel-ready");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      current = wrap(current - 1);
      update();
    }
    if (e.key === "ArrowRight") {
      current = wrap(current + 1);
      update();
    }
  });

  // Swipe / drag support
  const viewport = document.querySelector(".carousel-viewport");
  const SWIPE_THRESHOLD = 40;
  let dragStartX = null;

  function onSwipeStart(x) {
    dragStartX = x;
  }

  function onSwipeEnd(x) {
    if (dragStartX === null) return;
    const diff = dragStartX - x;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      wasDrag = true;
      // On desktop the browser suppresses the click event after a large drag,
      // so wasDrag would never be cleared by the click handler, so we auto-clear it.
      setTimeout(() => {
        wasDrag = false;
      }, 100);
      current = wrap(current + (diff > 0 ? 1 : -1));
      update();
    }
    dragStartX = null;
  }

  // Touch
  viewport.addEventListener(
    "touchstart",
    (e) => onSwipeStart(e.touches[0].clientX),
    { passive: true },
  );
  viewport.addEventListener("touchend", (e) =>
    onSwipeEnd(e.changedTouches[0].clientX),
  );

  // Mouse drag
  viewport.addEventListener("mousedown", (e) =>
    onSwipeStart(e.clientX),
  );
  viewport.addEventListener("mouseup", (e) => onSwipeEnd(e.clientX));
  viewport.addEventListener("mouseleave", () => {
    dragStartX = null;
  });

  // Card interactions
  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      if (wasDrag) {
        wasDrag = false;
        return;
      }
      if (Number(card.dataset.pos) === 0) {
        const { slug, display, frameBg } = card.dataset;
        openModal(slug, display, frameBg);
      } else {
        current = i;
        update();
      }
    });

    const previewBtn = card.querySelector(".card-preview-btn");
    if (!previewBtn) return;
    previewBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const { slug } = card.dataset;
      try {
        const manifest = await getManifest(slug);
        const sounds = Object.values(
          manifest.categories || {},
        ).flatMap((c) => c.sounds);
        if (sounds.length) {
          const sound =
            sounds[Math.floor(Math.random() * sounds.length)];
          playSound(previewBtn, `assets/packs/${slug}/${sound.file}`);
        }
      } catch {}
    });
  });
}
