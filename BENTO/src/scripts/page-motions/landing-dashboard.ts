import { gsap, prefersReducedMotion } from "../gsap-init";
import { playUiClick } from "../audio";
import { createPageMotion } from "./utils";

export const landingMotion = createPageMotion(() => {
  /* Gate + cinema playback is owned by landing-journey.ts */
});

const FACILITY_AUTO_MS = 4200;

function startFacilityGallery(root: HTMLElement) {
  const host = root.querySelector<HTMLElement>("[data-facility-gallery]");
  const viewport = root.querySelector<HTMLElement>("[data-facility-viewport]");
  const track = root.querySelector<HTMLElement>("[data-facility-track]");
  const prevBtn = root.querySelector<HTMLButtonElement>("[data-facility-prev]");
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-facility-next]");
  if (!host || !viewport || !track) return () => {};

  const slides = [...track.querySelectorAll<HTMLElement>("[data-facility-slide]")];
  const realCount = slides.length - 2;
  if (realCount < 1) return () => {};

  const reduce = prefersReducedMotion();
  let index = 1;
  let timer: number | undefined;
  let lastW = 0;

  const layout = () => {
    const w = viewport.clientWidth;
    if (w === lastW) return w;
    lastW = w;
    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${w}px`;
      slide.style.width = `${w}px`;
    });
    return w;
  };

  const snapIfClone = (target: number) => {
    const w = lastW || layout();
    if (target === slides.length - 1) {
      index = 1;
      gsap.set(track, { x: -w });
      return;
    }
    if (target === 0) {
      index = realCount;
      gsap.set(track, { x: -realCount * w });
    }
  };

  const setX = (target: number, animate: boolean) => {
    const w = lastW || layout();
    const x = -target * w;
    if (!animate || reduce) {
      gsap.set(track, { x });
      snapIfClone(target);
      return;
    }

    gsap.to(track, {
      x,
      duration: 0.7,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => snapIfClone(target),
    });
  };

  const go = (dir: number) => {
    if (gsap.isTweening(track)) return;
    index += dir;
    setX(index, true);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  };

  const start = () => {
    stop();
    if (reduce) return;
    timer = window.setInterval(() => go(1), FACILITY_AUTO_MS);
  };

  const onPrev = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    go(-1);
    start();
  };

  const onNext = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    go(1);
    start();
  };

  const onResize = () => {
    const w = viewport.clientWidth;
    if (w === lastW || w < 8) return;
    gsap.killTweensOf(track);
    gsap.set(track, { x: -index * layout() });
    snapIfClone(index);
  };

  gsap.set(track, { x: -layout() });
  prevBtn?.addEventListener("click", onPrev);
  nextBtn?.addEventListener("click", onNext);
  host.addEventListener("mouseenter", stop);
  host.addEventListener("mouseleave", start);
  const ro = new ResizeObserver(onResize);
  ro.observe(viewport);
  start();

  return () => {
    stop();
    ro.disconnect();
    prevBtn?.removeEventListener("click", onPrev);
    nextBtn?.removeEventListener("click", onNext);
    host.removeEventListener("mouseenter", stop);
    host.removeEventListener("mouseleave", start);
    gsap.killTweensOf(track);
    gsap.set(track, { clearProps: "transform" });
  };
}

export const dashboardMotion = createPageMotion((root) => {
  const stopGallery = startFacilityGallery(root);
  if (prefersReducedMotion()) return stopGallery;

  const onEnter = (event: Event) => {
    playUiClick();
    gsap.to(event.currentTarget as HTMLElement, {
      filter: "brightness(1.04)",
      duration: 0.5,
      ease: "power1.out",
    });
  };
  const onLeave = (event: Event) => {
    gsap.to(event.currentTarget as HTMLElement, {
      filter: "brightness(1)",
      duration: 0.55,
      ease: "power1.out",
    });
  };

  const tiles = [...root.querySelectorAll<HTMLElement>("[data-tile-nav]")];
  tiles.forEach((tile) => {
    tile.addEventListener("mouseenter", onEnter);
    tile.addEventListener("mouseleave", onLeave);
  });

  return () => {
    stopGallery();
    tiles.forEach((tile) => {
      tile.removeEventListener("mouseenter", onEnter);
      tile.removeEventListener("mouseleave", onLeave);
      gsap.set(tile, { clearProps: "filter" });
    });
  };
});
