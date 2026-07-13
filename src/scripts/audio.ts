const DEFAULT_VOLUME = 0.5;
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

function setPlayingState(button: HTMLButtonElement, playing: boolean) {
  button.dataset.playing = playing ? "true" : "false";
  button.setAttribute("aria-pressed", String(playing));
  button.setAttribute(
    "aria-label",
    playing ? "Pause background music" : "Play background music",
  );
}

export function initAudio() {
  const audio = document.getElementById("site-audio") as HTMLAudioElement | null;
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-audio-toggle]");

  if (!audio || buttons.length === 0) return;

  audio.loop = true;
  audio.volume = DEFAULT_VOLUME;

  const syncUi = () => {
    const playing = !audio.paused;
    buttons.forEach((button) => setPlayingState(button, playing));
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      unlockUiClick();
      if (audio.paused) {
        audio.play().catch(() => syncUi());
      } else {
        audio.pause();
      }
    });
  });

  audio.addEventListener("play", syncUi);
  audio.addEventListener("pause", syncUi);
  audio.addEventListener("ended", () => {
    if (audio.loop) {
      audio.currentTime = 0;
      audio.play().catch(() => syncUi());
    }
    syncUi();
  });

  syncUi();
  document.addEventListener("pointerdown", () => unlockUiClick(), { once: true, passive: true });
}
