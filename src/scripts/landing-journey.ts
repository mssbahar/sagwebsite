import { gsap, prefersReducedMotion } from "./gsap-init";

type Phase = "cinema" | "home" | "idle";

const VEIL_CINEMA = 0.08;
const VEIL_HOME = 0.22;
const VEIL_DASH = 0.4;

export function initLandingJourney() {
  const landing = document.querySelector<HTMLElement>('[data-view="landing"]');
  const video = document.querySelector<HTMLVideoElement>(
    "[data-landing-video]",
  );
  const skip = document.querySelector<HTMLButtonElement>("[data-cinema-skip]");
  const soundBtn = document.querySelector<HTMLButtonElement>("[data-cinema-sound]");
  const chrome = document.querySelector<HTMLElement>("[data-cinema-chrome]");
  const home = document.querySelector<HTMLElement>("[data-landing-home]");
  const veil = document.querySelector<HTMLElement>("[data-landing-veil]");
  if (!landing || !video || !skip || !home || !chrome) return;

  let finishing = false;
  let unlockBound = false;

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

  const setSoundButtonVisible = (visible: boolean) => {
    if (!soundBtn) return;
    soundBtn.hidden = !visible;
  };

  const unmuteIntro = async () => {
    if (landing.dataset.landingPhase !== "cinema") return;
    video.muted = false;
    setSoundButtonVisible(false);
    try {
      await video.play();
    } catch {
      /* keep trying on next gesture */
      setSoundButtonVisible(true);
    }
  };

  const bindSoundUnlock = () => {
    if (unlockBound) return;
    unlockBound = true;

    const onGesture = () => {
      void unmuteIntro();
    };

    document.addEventListener("pointerdown", onGesture, { passive: true });
    document.addEventListener("keydown", onGesture);
    soundBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      void unmuteIntro();
    });
  };

  const showHome = () => {
    finishing = false;
    video.loop = true;
    video.muted = true;
    setSoundButtonVisible(false);
    showLayer(chrome, false);
    showLayer(home, true);
    setVeil(VEIL_HOME, prefersReducedMotion() ? 0 : 0.4);
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

  const playIntroWithSound = async () => {
    bindSoundUnlock();
    video.muted = false;
    try {
      await video.play();
      setSoundButtonVisible(false);
      return;
    } catch {
      /* Browsers block autoplay + sound until a user gesture */
    }

    video.muted = true;
    setSoundButtonVisible(true);
    try {
      await video.play();
    } catch {
      finishCinema();
    }
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
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
    void playIntroWithSound();
  };

  skip.addEventListener("click", finishCinema);
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
    showLayer(chrome, false);
    showLayer(home, true);
    setVeil(VEIL_DASH);
    setPhase("idle");
    return;
  }

  if (prefersReducedMotion()) {
    showHome();
    return;
  }

  startCinema();
}
