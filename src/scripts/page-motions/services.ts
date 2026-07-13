import { gsap, prefersReducedMotion, ScrollTrigger } from "../gsap-init";
import { MOTION } from "../motion";
import { createPageMotion, getScrollRoot } from "./utils";

function initServicesCatalog(root: HTMLElement, scroller: HTMLElement) {
  const chapters = [...root.querySelectorAll<HTMLElement>("[data-service-chapter]")];
  const navLinks = [...root.querySelectorAll<HTMLElement>("[data-service-nav]")];
  const triggers: ScrollTrigger[] = [];
  const cleanups: Array<() => void> = [];

  if (!chapters.length) return () => {};

  const setActive = (id: string) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.serviceTarget === id);
    });
  };

  chapters.forEach((chapter, i) => {
    const id = chapter.dataset.serviceId ?? "";
    const image = chapter.querySelector<HTMLElement>("[data-service-chapter-img]");
    const fromX = i % 2 === 0 ? -36 : 36;

    const nav = navLinks.find((link) => link.dataset.serviceTarget === id);
    const onNavClick = () => {
      const top = chapter.offsetTop - 12;
      scroller.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    };
    nav?.addEventListener("click", onNavClick);
    cleanups.push(() => nav?.removeEventListener("click", onNavClick));

    if (prefersReducedMotion()) return;

    gsap.set(chapter, { autoAlpha: 0, y: 32, x: fromX * 0.25 });

    triggers.push(
      ScrollTrigger.create({
        trigger: chapter,
        scroller,
        start: "top 72%",
        end: "bottom 28%",
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      }),
    );

    triggers.push(
      ScrollTrigger.create({
        trigger: chapter,
        scroller,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(chapter, {
            autoAlpha: 1,
            y: 0,
            x: 0,
            duration: 0.9,
            ease: MOTION.panelEase,
          });
        },
      }),
    );

    if (image) {
      const imgTween = gsap.fromTo(
        image,
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: chapter,
            scroller,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
      cleanups.push(() => {
        imgTween.scrollTrigger?.kill();
        imgTween.kill();
      });
    }
  });

  if (prefersReducedMotion() && chapters[0]?.dataset.serviceId) {
    setActive(chapters[0].dataset.serviceId);
  }

  return () => {
    triggers.forEach((t) => t.kill());
    cleanups.forEach((fn) => fn());
  };
}

export const servicesMotion = createPageMotion((root) => {
  const scroller = getScrollRoot(root);
  const teardownCatalog = initServicesCatalog(root, scroller);

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

  const processSteps = [...root.querySelectorAll<HTMLElement>(".services-process__step")];
  const processTriggers: ScrollTrigger[] = [];

  if (!prefersReducedMotion()) {
    gsap.set(processSteps, { autoAlpha: 0, y: 24 });
    processSteps.forEach((step, i) => {
      processTriggers.push(
        ScrollTrigger.create({
          trigger: step,
          scroller,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(step, {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              delay: i * 0.08,
              ease: MOTION.panelEase,
            });
          },
        }),
      );
    });
  }

  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    teardownCatalog();
    heroTween?.scrollTrigger?.kill();
    heroTween?.kill();
    processTriggers.forEach((t) => t.kill());
  };
});
