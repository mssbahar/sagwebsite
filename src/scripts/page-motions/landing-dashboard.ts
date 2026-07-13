import { gsap, prefersReducedMotion } from "../gsap-init";
import { playUiClick } from "../audio";
import { createPageMotion } from "./utils";

export const landingMotion = createPageMotion(() => {
  const video = document.querySelector<HTMLVideoElement>('[data-view="landing"] video');
  if (!video || prefersReducedMotion()) return;

  gsap.fromTo(
    video,
    { scale: 1.04 },
    { scale: 1.08, duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" },
  );
});

export const dashboardMotion = createPageMotion((root) => {
  if (prefersReducedMotion()) return;

  const onEnter = (event: Event) => {
    playUiClick();
    gsap.to(event.currentTarget as HTMLElement, {
      filter: "brightness(1.08)",
      duration: 0.45,
      ease: "power2.out",
    });
  };
  const onLeave = (event: Event) => {
    gsap.to(event.currentTarget as HTMLElement, {
      filter: "brightness(1)",
      duration: 0.55,
      ease: "power2.out",
    });
  };

  const tiles = [...root.querySelectorAll<HTMLElement>("[data-tile-nav]")];
  tiles.forEach((tile) => {
    tile.addEventListener("mouseenter", onEnter);
    tile.addEventListener("mouseleave", onLeave);
  });

  return () => {
    tiles.forEach((tile) => {
      tile.removeEventListener("mouseenter", onEnter);
      tile.removeEventListener("mouseleave", onLeave);
      gsap.set(tile, { clearProps: "filter" });
    });
  };
});
