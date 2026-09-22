import { gsap } from "../gsap-init";
import { MOTION } from "../motion";
import { createPageMotion, getScrollRoot } from "./utils";

export const promotionsMotion = createPageMotion((root) => {
  const scroller = getScrollRoot(root);
  const cards = [...root.querySelectorAll<HTMLElement>("[data-promo-card]")];

  cards.forEach((card, i) => {
    gsap.fromTo(
      card,
      { autoAlpha: 0, y: 20, immediateRender: false },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        delay: i * 0.1,
        ease: MOTION.panelEase,
        scrollTrigger: {
          trigger: card,
          scroller,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
});
