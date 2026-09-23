import { gsap, prefersReducedMotion, ScrollTrigger } from "../gsap-init";
import { MOTION } from "../motion";
import type { getScrollRoot } from "./utils";

type Scroller = ReturnType<typeof getScrollRoot>;

export function initJourneyTimeline(root: HTMLElement, scroller: Scroller) {
  const journey = root.querySelector<HTMLElement>("[data-journey-timeline]");
  if (!journey) return () => {};

  const items = [...journey.querySelectorAll<HTMLElement>("[data-journey-item]")];
  const rows = [...journey.querySelectorAll<HTMLElement>("[data-journey-row]")];
  const triggers: ScrollTrigger[] = [];

  if (prefersReducedMotion()) {
    journey.classList.add("is-line-drawn");
    items.forEach((item) => {
      item.classList.add("is-visible");
      gsap.set(item.querySelector("[data-journey-card]"), { autoAlpha: 1, y: 0 });
    });
    rows.forEach((row) => row.classList.add("is-path-drawn"));
    return () => {};
  }

  gsap.set(
    items.map((item) => item.querySelector("[data-journey-card]")),
    { autoAlpha: 0, y: 24 },
  );

  rows.forEach((row) => {
    const trigger = ScrollTrigger.create({
      trigger: row,
      scroller,
      start: "top 82%",
      once: true,
      onEnter: () => {
        row.classList.add("is-path-drawn");
        row.querySelectorAll<HTMLElement>("[data-journey-item]").forEach((item, i) => {
          const card = item.querySelector<HTMLElement>("[data-journey-card]");
          item.classList.add("is-visible");
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              delay: i * 0.1,
              ease: MOTION.panelEase,
            },
          );
        });
      },
    });
    triggers.push(trigger);
  });

  return () => {
    triggers.forEach((t) => t.kill());
  };
}
