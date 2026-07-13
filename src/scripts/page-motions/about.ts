import { gsap, prefersReducedMotion } from "../gsap-init";
import { MOTION } from "../motion";
import { createPageMotion, getScrollRoot } from "./utils";
import { initJourneyTimeline } from "./journey-timeline";

export const aboutMotion = createPageMotion((root) => {
  const scroller = getScrollRoot(root);
  let teardownJourney = initJourneyTimeline(root, scroller);

  root.querySelectorAll<HTMLElement>("[data-line-reveal]").forEach((line) => {
    gsap.fromTo(
      line,
      { y: "110%", opacity: 0, immediateRender: false },
      {
        y: "0%",
        opacity: 1,
        duration: 1.1,
        ease: MOTION.panelEase,
        scrollTrigger: {
          trigger: line,
          scroller,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  root.querySelectorAll<HTMLElement>("[data-parallax-img]").forEach((img) => {
    gsap.fromTo(
      img,
      { y: -20 },
      {
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement ?? img,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  });

  const planCards = [...root.querySelectorAll<HTMLElement>("[data-about-plan]")];
  const plansGrid = root.querySelector<HTMLElement>("[data-about-plans-grid]");
  if (planCards.length && plansGrid) {
    gsap.set(planCards, { autoAlpha: prefersReducedMotion() ? 1 : 0, y: prefersReducedMotion() ? 0 : 28 });
    if (!prefersReducedMotion()) {
      gsap.to(planCards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: MOTION.panelEase,
        scrollTrigger: {
          trigger: plansGrid,
          scroller,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }

  return () => {
    teardownJourney?.();
    teardownJourney = undefined;
  };
});
