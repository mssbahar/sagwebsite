import { gsap, prefersReducedMotion, ScrollTrigger } from "../gsap-init";
import { createPageMotion, getScrollRoot } from "./utils";

export const servicesMotion = createPageMotion((root) => {
  const scroller = getScrollRoot(root);
  const heroImg = root.querySelector<HTMLElement>("[data-services-hero-img]");
  let heroTween: gsap.core.Tween | null = null;

  if (heroImg && !prefersReducedMotion()) {
    heroTween = gsap.fromTo(
      heroImg,
      { y: -16 },
      {
        y: 16,
        ease: "none",
        scrollTrigger: {
          trigger: heroImg.parentElement ?? heroImg,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  }

  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    heroTween?.scrollTrigger?.kill();
    heroTween?.kill();
  };
});
