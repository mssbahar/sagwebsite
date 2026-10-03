import { gsap, prefersReducedMotion } from "../gsap-init";
import { MOTION } from "../motion";
import { createPageMotion, getScrollRoot } from "./utils";

export const aboutMotion = createPageMotion((root) => {
  const scroller = getScrollRoot(root);
  const carGets = root.querySelector<HTMLElement>("[data-car-gets]");

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

  const planCards = [
    ...root.querySelectorAll<HTMLElement>("[data-about-plan]"),
  ];
  const plansGrid = root.querySelector<HTMLElement>("[data-about-plans-grid]");
  const planCleanups: Array<() => void> = [];
  let carGetsObserver: IntersectionObserver | null = null;

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

  if (carGets && !prefersReducedMotion()) {
    const photos = carGets.querySelectorAll<HTMLElement>(
      "[data-car-gets-photo]",
    );
    const titles = carGets.querySelectorAll<HTMLElement>(
      "[data-car-gets-title]",
    );
    const bodies = carGets.querySelectorAll<HTMLElement>(
      "[data-car-gets-body]",
    );
    const pieces = [photos, titles, bodies];

    gsap.set(pieces, { autoAlpha: 0, y: 16 });

    const play = () => {
      gsap
        .timeline({ overwrite: "auto" })
        .to(
          photos,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: MOTION.panelEase,
            clearProps: "transform",
          },
          0,
        )
        .to(
          titles,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: MOTION.panelEase,
            clearProps: "transform",
          },
          0.08,
        )
        .to(
          bodies,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: MOTION.panelEase,
            clearProps: "transform",
          },
          0.14,
        );
    };

    carGetsObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        carGetsObserver?.disconnect();
        carGetsObserver = null;
        play();
      },
      { root: scroller, threshold: 0.15 },
    );
    carGetsObserver.observe(carGets);
  }

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
    carGetsObserver?.disconnect();
    if (carGets) {
      gsap.killTweensOf(
        carGets.querySelectorAll(
          "[data-car-gets-photo], [data-car-gets-title], [data-car-gets-body]",
        ),
      );
    }
    planCleanups.forEach((fn) => fn());
  };
});
