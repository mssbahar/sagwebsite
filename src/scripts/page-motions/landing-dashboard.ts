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

  const moving = () => slides.some((slide) => gsap.isTweening(slide));

  const place = (animate: boolean, onDone?: () => void) => {
    const w = viewport.clientWidth;
    if (w < 8) return;
    lastW = w;
    slides.forEach((slide, i) => {
      const x = (i - index) * w;
      if (!animate || reduce) {
        gsap.set(slide, { x });
        return;
      }
      gsap.to(slide, {
        x,
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: "auto",
        onComplete: i === index ? onDone : undefined,
      });
    });
    if (!animate || reduce) onDone?.();
  };

  const settleClone = () => {
    if (index >= slides.length - 1) index = 1;
    else if (index <= 0) index = realCount;
    else return;
    place(false);
  };

  const go = (dir: number) => {
    if (moving()) return;
    settleClone();
    const next = index + dir;
    if (next < 0 || next > slides.length - 1) return;
    index = next;
    place(true, settleClone);
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
    if (w < 8 || w === lastW) return;
    slides.forEach((slide) => gsap.killTweensOf(slide));
    if (index >= slides.length - 1 || index <= 0) settleClone();
    else place(false);
  };

  const onVis = () => {
    if (document.hidden) stop();
    else start();
  };

  place(false);
  prevBtn?.addEventListener("click", onPrev);
  nextBtn?.addEventListener("click", onNext);
  host.addEventListener("mouseenter", stop);
  host.addEventListener("mouseleave", start);
  document.addEventListener("visibilitychange", onVis);
  const ro = new ResizeObserver(onResize);
  ro.observe(viewport);
  start();

  return () => {
    stop();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    prevBtn?.removeEventListener("click", onPrev);
    nextBtn?.removeEventListener("click", onNext);
    host.removeEventListener("mouseenter", stop);
    host.removeEventListener("mouseleave", start);
    slides.forEach((slide) => {
      gsap.killTweensOf(slide);
      gsap.set(slide, { clearProps: "transform" });
    });
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
