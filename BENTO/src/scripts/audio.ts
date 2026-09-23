const UI_CLICK_SRC = "/audio/ui-click.mp3";
const UI_CLICK_VOLUME = 0.38;

let uiClickAudio: HTMLAudioElement | null = null;
let uiClickUnlocked = false;

function getUiClickAudio() {
  if (!uiClickAudio) {
    uiClickAudio = new Audio(UI_CLICK_SRC);
    uiClickAudio.preload = "auto";
    uiClickAudio.volume = UI_CLICK_VOLUME;
  }
  return uiClickAudio;
}

function unlockUiClick() {
  if (uiClickUnlocked) return;
  const clip = getUiClickAudio();
  clip.play()
    .then(() => {
      clip.pause();
      clip.currentTime = 0;
      uiClickUnlocked = true;
    })
    .catch(() => {
      /* wait for next gesture */
    });
}

/** Short UI click — dashboard tile hover, etc. */
export function playUiClick() {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const clip = getUiClickAudio();
  const node = clip.cloneNode(true) as HTMLAudioElement;
  node.volume = UI_CLICK_VOLUME;
  node.play().catch(() => {
    unlockUiClick();
  });
}

if (typeof document !== "undefined") {
  document.addEventListener("pointerdown", () => unlockUiClick(), { once: true, passive: true });
}
