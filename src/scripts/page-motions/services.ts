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

function initProcessStepper(root: HTMLElement, scroller: HTMLElement) {
  const stepper = root.querySelector<HTMLElement>("[data-services-process]");
  if (!stepper) return () => {};

  const nodes = [...stepper.querySelectorAll<HTMLButtonElement>("[data-process-step]")];
  const panels = [...stepper.querySelectorAll<HTMLElement>("[data-process-panel]")];
  const cleanups: Array<() => void> = [];

  const activate = (index: number) => {
    nodes.forEach((node, i) => {
      const active = i === index;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel, i) => {
      const active = i === index;
      if (!active) {
        panel.classList.remove("is-active");
        panel.hidden = true;
        return;
      }

      panel.hidden = false;
      panel.classList.add("is-active");

      if (!prefersReducedMotion()) {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: MOTION.panelEase },
        );
      }
    });
  };

  nodes.forEach((node, i) => {
    const onClick = () => activate(i);
    node.addEventListener("click", onClick);
    cleanups.push(() => node.removeEventListener("click", onClick));
  });

  let enterTrigger: ScrollTrigger | undefined;
  if (!prefersReducedMotion()) {
    gsap.set(stepper, { autoAlpha: 0, y: 20 });
    enterTrigger = ScrollTrigger.create({
      trigger: stepper,
      scroller,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(stepper, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: MOTION.panelEase,
        });
      },
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
    enterTrigger?.kill();
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

  const teardownProcess = initProcessStepper(root, scroller);

  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    teardownCatalog();
    teardownProcess();
    heroTween?.scrollTrigger?.kill();
    heroTween?.kill();
  };
});
