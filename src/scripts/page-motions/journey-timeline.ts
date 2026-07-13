import { gsap, prefersReducedMotion, ScrollTrigger } from "../gsap-init";
import { MOTION } from "../motion";
import type { getScrollRoot } from "./utils";

type Scroller = ReturnType<typeof getScrollRoot>;

export function initJourneyTimeline(root: HTMLElement, scroller: Scroller) {
  const journey = root.querySelector<HTMLElement>("[data-journey-timeline]");
  if (!journey) return () => {};

  const items = [...journey.querySelectorAll<HTMLElement>("[data-journey-item]")];
  const triggers: ScrollTrigger[] = [];

  if (prefersReducedMotion()) {
    journey.classList.add("is-line-drawn");
    items.forEach((item) => {
      item.classList.add("is-visible");
      gsap.set(item.querySelector("[data-journey-card]"), { autoAlpha: 1, x: 0 });
    });
    return () => {};
  }

  gsap.set(
    items.map((item) => item.querySelector("[data-journey-card]")),
    { autoAlpha: 0, x: 0 },
  );

  const lineTrigger = ScrollTrigger.create({
    trigger: journey,
    scroller,
    start: "top 78%",
    once: true,
    onEnter: () => journey.classList.add("is-line-drawn"),
  });
  triggers.push(lineTrigger);

  items.forEach((item) => {
    const card = item.querySelector<HTMLElement>("[data-journey-card]");
    const side = item.dataset.journeySide === "right" ? 28 : -28;

    const trigger = ScrollTrigger.create({
      trigger: item,
      scroller,
      start: "top 85%",
      once: true,
      onEnter: () => {
        item.classList.add("is-visible");
        gsap.fromTo(
          card,
          { autoAlpha: 0, x: side },
          { autoAlpha: 1, x: 0, duration: 0.8, ease: MOTION.panelEase },
        );
      },
    });
    triggers.push(trigger);
  });

  return () => {
    triggers.forEach((t) => t.kill());
  };
}
