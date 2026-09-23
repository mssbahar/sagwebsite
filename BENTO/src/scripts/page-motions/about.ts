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
  const planCleanups: Array<() => void> = [];

  const setExpanded = (card: HTMLElement | null) => {
    planCards.forEach((item) => {
      const open = item === card;
      item.classList.toggle("is-expanded", open);
      item.setAttribute("aria-expanded", String(open));
    });
  };

  planCards.forEach((card) => {
    const onActivate = () => {
      const already = card.classList.contains("is-expanded");
      setExpanded(already ? null : card);
    };
    const onClick = () => onActivate();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onActivate();
      }
    };
    card.addEventListener("click", onClick);
    card.addEventListener("keydown", onKeyDown);
    planCleanups.push(() => {
      card.removeEventListener("click", onClick);
      card.removeEventListener("keydown", onKeyDown);
    });
  });

  if (planCards.length && plansGrid && !prefersReducedMotion()) {
    gsap.fromTo(
      planCards,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: MOTION.panelEase,
        scrollTrigger: {
          trigger: plansGrid,
          scroller,
          start: "top 85%",
          once: true,
        },
      },
    );
  }

  return () => {
    planCleanups.forEach((fn) => fn());
    teardownJourney?.();
    teardownJourney = undefined;
  };
});
