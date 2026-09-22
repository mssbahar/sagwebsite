import { gsap, prefersReducedMotion } from "./gsap-init";
import { setSiteAudioPlaying } from "./audio";
import { navigate } from "./views";

type Phase = "cinema" | "home" | "idle";

const SEEN_KEY = "sag-seen-cinema";
const VEIL_CINEMA = 0.08;
const VEIL_DASH = 0.4;

function hasSeenCinema() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markCinemaSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function initLandingJourney() {
  const landing = document.querySelector<HTMLElement>('[data-view="landing"]');
  const video = document.querySelector<HTMLVideoElement>("[data-landing-video]");
  const skip = document.querySelector<HTMLButtonElement>("[data-cinema-skip]");
  const sound = document.querySelector<HTMLButtonElement>("[data-cinema-sound]");
  const chrome = document.querySelector<HTMLElement>("[data-cinema-chrome]");
  const home = document.querySelector<HTMLElement>("[data-landing-home]");
  const veil = document.querySelector<HTMLElement>("[data-landing-veil]");
  if (!landing || !video || !skip || !home || !chrome) return;

  let finishing = false;

  const setPhase = (phase: Phase) => {
    landing.dataset.landingPhase = phase;
    document.documentElement.dataset.landingPhase = phase;
  };

  const setVeil = (opacity: number, duration = 0) => {
    if (!veil) return;
    if (duration === 0 || prefersReducedMotion()) {
      gsap.set(veil, { opacity });
      return;
    }
    gsap.to(veil, { opacity, duration, ease: "power2.inOut" });
  };

  const showLayer = (el: HTMLElement, visible: boolean) => {
    if (visible) {
      el.hidden = false;
      gsap.set(el, { autoAlpha: 1, pointerEvents: "auto" });
      return;
    }
    gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
    el.hidden = true;
  };

  const showHome = () => {
    finishing = false;
    markCinemaSeen();
    video.loop = true;
    video.muted = true;
    showLayer(chrome, false);
    showLayer(home, true);
    setVeil(0, prefersReducedMotion() ? 0 : 0.4);
    setPhase("home");
    document.dispatchEvent(new CustomEvent("landing:home"));
    video.play()?.catch(() => {
      /* poster remains */
    });
  };

  const finishCinema = () => {
    if (finishing) return;
    if (landing.dataset.landingPhase !== "cinema") return;
    finishing = true;
    showHome();
  };

  const startCinema = () => {
    finishing = false;
    setPhase("cinema");
    showLayer(home, false);
    showLayer(chrome, true);
    setVeil(VEIL_CINEMA);
    gsap.fromTo(
      chrome,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.4, delay: 0.35, pointerEvents: "auto" },
    );

    video.loop = false;
    video.muted = true;
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
    video.play()?.catch(() => finishCinema());
  };

  skip.addEventListener("click", finishCinema);
  sound?.addEventListener("click", () => {
    video.muted = false;
    setSiteAudioPlaying(true);
    sound.hidden = true;
  });
  video.addEventListener("ended", finishCinema);
  video.addEventListener("error", () => {
    if (landing.dataset.landingPhase === "cinema") finishCinema();
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") return;
      if (landing.dataset.landingPhase !== "cinema") return;
      event.stopImmediatePropagation();
      finishCinema();
    },
    true,
  );

  document.addEventListener("view:enter", (event) => {
    const view = (event as CustomEvent<string>).detail;
    if (view !== "landing") return;
    if (landing.dataset.landingPhase === "cinema") return;
    showHome();
  });

  const startView = document.documentElement.dataset.appView || "landing";
  if (startView !== "landing") {
    markCinemaSeen();
    showLayer(chrome, false);
    showLayer(home, true);
    setVeil(VEIL_DASH);
    setPhase("idle");
    return;
  }

  if (hasSeenCinema() || prefersReducedMotion()) {
    showHome();
    return;
  }

  startCinema();
}
