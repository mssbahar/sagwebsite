import { gsap, prefersReducedMotion, ScrollTrigger } from "../gsap-init";
import { MOTION } from "../motion";
import { createPageMotion, getScrollRoot } from "./utils";

const DESKTOP_MQ = "(min-width: 768px)";

function initServicesCatalog(root: HTMLElement, scroller: HTMLElement) {
  const items = [...root.querySelectorAll<HTMLElement>("[data-service-accordion]")];
  const triggers = [...root.querySelectorAll<HTMLButtonElement>("[data-service-nav]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-service-panel]")];
  const scrollTriggers: ScrollTrigger[] = [];
  const cleanups: Array<() => void> = [];

  if (!items.length) return () => {};

  const isDesktop = () => window.matchMedia(DESKTOP_MQ).matches;

  const setActiveNav = (id: string) => {
    triggers.forEach((trigger) => {
      const active = trigger.dataset.serviceTarget === id;
      trigger.classList.toggle("is-active", active);
      trigger.setAttribute("aria-expanded", String(active));
    });
  };

  const openPanel = (index: number) => {
    panels.forEach((panel, i) => {
      const open = i === index;
      panel.classList.toggle("is-open", open);
      panel.hidden = !open;
      if (open && !prefersReducedMotion()) {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: MOTION.panelEase },
        );
      }
    });
    const id = items[index]?.dataset.serviceId;
    if (id) setActiveNav(id);
  };

  const closeAllPanels = () => {
    panels.forEach((panel) => {
      panel.classList.remove("is-open");
      panel.hidden = true;
    });
    triggers.forEach((trigger) => {
      trigger.classList.remove("is-active");
      trigger.setAttribute("aria-expanded", "false");
    });
  };

  triggers.forEach((trigger, index) => {
    const onClick = () => {
      if (isDesktop()) {
        const chapter = panels[index];
        if (!chapter) return;
        const top = chapter.offsetTop - 12;
        scroller.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        return;
      }

      const isOpen = trigger.classList.contains("is-active");
      if (isOpen) {
        closeAllPanels();
        return;
      }
      openPanel(index);
    };

    trigger.addEventListener("click", onClick);
    cleanups.push(() => trigger.removeEventListener("click", onClick));
  });

  items.forEach((item, i) => {
    const id = item.dataset.serviceId ?? "";
    const panel = panels[i];
    const image = panel?.querySelector<HTMLElement>("[data-service-chapter-img]");

    if (prefersReducedMotion()) return;

    if (panel) {
      gsap.set(panel, { autoAlpha: isDesktop() ? 1 : i === 0 ? 1 : 0, y: 0 });

      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: panel,
          scroller,
          start: "top 72%",
          end: "bottom 28%",
          onEnter: () => {
            if (isDesktop()) setActiveNav(id);
          },
          onEnterBack: () => {
            if (isDesktop()) setActiveNav(id);
          },
        }),
      );

      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: panel,
          scroller,
          start: "top 82%",
          once: true,
          onEnter: () => {
            if (!isDesktop()) return;
            gsap.to(panel, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: MOTION.panelEase,
            });
          },
        }),
      );
    }

    if (image && panel) {
      const imgTween = gsap.fromTo(
        image,
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
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

  const onResize = () => {
    if (isDesktop()) {
      panels.forEach((panel) => {
        panel.hidden = false;
        panel.classList.add("is-open");
        gsap.set(panel, { clearProps: "autoAlpha,y" });
      });
      if (items[0]?.dataset.serviceId) setActiveNav(items[0].dataset.serviceId);
    } else {
      const openIndex = panels.findIndex((p) => p.classList.contains("is-open"));
      panels.forEach((panel, i) => {
        const show = i === (openIndex >= 0 ? openIndex : 0);
        panel.hidden = !show;
        panel.classList.toggle("is-open", show);
      });
    }
    ScrollTrigger.refresh();
  };

  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));

  return () => {
    scrollTriggers.forEach((t) => t.kill());
    cleanups.forEach((fn) => fn());
  };
}

function initProcessStepper(root: HTMLElement, scroller: HTMLElement) {
  const stepper = root.querySelector<HTMLElement>("[data-services-process]");
  if (!stepper) return () => {};

  const items = [...stepper.querySelectorAll<HTMLElement>(".process-stepper__item")];
  const nodes = [...stepper.querySelectorAll<HTMLButtonElement>("[data-process-step]")];
  const panels = [...stepper.querySelectorAll<HTMLElement>("[data-process-panel]")];
  const cleanups: Array<() => void> = [];

  const activate = (index: number, toggleClose = true) => {
    const current = nodes.findIndex((n) => n.classList.contains("is-active"));
    if (toggleClose && current === index) {
      nodes[index]?.classList.remove("is-active");
      nodes[index]?.setAttribute("aria-selected", "false");
      nodes[index]?.setAttribute("aria-expanded", "false");
      const panel = panels[index];
      if (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
      }
      return;
    }

    nodes.forEach((node, i) => {
      const active = i === index;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-selected", String(active));
      node.setAttribute("aria-expanded", String(active));
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
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: MOTION.panelEase },
        );
      }
    });
  };

  nodes.forEach((node, i) => {
    const onClick = () => activate(i, true);
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
