import { gsap, prefersReducedMotion, ScrollTrigger } from "../gsap-init";
import { MOTION } from "../motion";
import { createPageMotion, getScrollRoot } from "./utils";

function initWorkshopBays(root: HTMLElement, scroller: HTMLElement) {
  const bays = [...root.querySelectorAll<HTMLElement>("[data-workshop-bay]")];
  const triggers: ScrollTrigger[] = [];
  const tweens: gsap.core.Tween[] = [];

  if (!bays.length || prefersReducedMotion()) return () => {};

  bays.forEach((bay, i) => {
    const image = bay.querySelector<HTMLElement>("[data-workshop-bay-img]");
    const copy = bay.querySelector<HTMLElement>(".workshop-bay__copy");
    const fromX = i % 2 === 0 ? -28 : 28;

    gsap.set(bay, { autoAlpha: 0, y: 40 });
    if (copy) gsap.set(copy, { x: fromX * 0.5 });

    triggers.push(
      ScrollTrigger.create({
        trigger: bay,
        scroller,
        start: "top 84%",
        once: true,
        onEnter: () => {
          gsap.to(bay, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: MOTION.panelEase,
          });
          if (copy) {
            gsap.to(copy, {
              x: 0,
              duration: 0.9,
              delay: 0.08,
              ease: MOTION.panelEase,
            });
          }
        },
      }),
    );

    if (image) {
      const imgTween = gsap.fromTo(
        image,
        { scale: 1.12, y: -12 },
        {
          scale: 1,
          y: 12,
          ease: "none",
          scrollTrigger: {
            trigger: bay,
            scroller,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.75,
          },
        },
      );
      tweens.push(imgTween);
    }
  });

  return () => {
    triggers.forEach((t) => t.kill());
    tweens.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
  };
}

export const workshopMotion = createPageMotion((root) => {
  const scroller = getScrollRoot(root);
  const teardownBays = initWorkshopBays(root, scroller);

  const heroImg = root.querySelector<HTMLElement>("[data-workshop-hero-img]");
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

  return () => {
    teardownBays();
    heroTween?.scrollTrigger?.kill();
    heroTween?.kill();
  };
});
