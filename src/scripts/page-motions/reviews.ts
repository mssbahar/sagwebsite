import { gsap, prefersReducedMotion } from "../gsap-init";
import { MOTION } from "../motion";
import { createPageMotion } from "./utils";

export const reviewsMotion = createPageMotion((root) => {
  const carousel = root.querySelector<HTMLElement>("[data-reviews-carousel]");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll<HTMLElement>("[data-carousel-slide]")];
  const prevBtn = carousel.querySelector<HTMLButtonElement>("[data-carousel-prev]");
  const nextBtn = carousel.querySelector<HTMLButtonElement>("[data-carousel-next]");
  if (slides.length <= 1) return;

  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) index = 0;

  let timer: number | undefined;
  let animating = false;

  const setSlideState = (slide: HTMLElement, active: boolean) => {
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  };

  const show = (next: number) => {
    if (animating) return;

    const nextIndex = (next + slides.length) % slides.length;
    if (nextIndex === index) return;

    const prev = slides[index];
    const current = slides[nextIndex];
    collapseQuote(prev);
    index = nextIndex;

    if (prefersReducedMotion()) {
      slides.forEach((slide, i) => setSlideState(slide, i === index));
      return;
    }

    animating = true;
    gsap.killTweensOf(slides);

    setSlideState(current, true);
    gsap.fromTo(
      current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.5,
        ease: MOTION.panelEase,
      },
    );

    if (prev && prev !== current) {
      gsap.to(prev, {
        autoAlpha: 0,
        duration: 0.4,
        ease: MOTION.panelEase,
        onComplete: () => {
          setSlideState(prev, false);
          gsap.set(prev, { clearProps: "opacity,visibility" });
          animating = false;
        },
      });
    } else {
      animating = false;
    }

    const stars = current.querySelector<HTMLElement>("[data-review-stars]");
    if (stars) {
      stars.querySelectorAll("svg").forEach((star, i) => {
        gsap.fromTo(
          star,
          { scale: 0 },
          { scale: 1, duration: 0.3, delay: 0.05 * i, ease: "back.out(2)" },
        );
      });
    }
  };

  const quoteIsOpen = () =>
    slides.some((slide) =>
      slide.querySelector("[data-review-quote]")?.classList.contains("is-expanded"),
    );

  const start = () => {
    if (prefersReducedMotion() || quoteIsOpen()) return;
    stop();
    timer = window.setInterval(() => show(index + 1), 8000);
  };
  const stop = () => {
    if (timer) window.clearInterval(timer);
  };

  const collapseQuote = (slide: HTMLElement) => {
    const quote = slide.querySelector<HTMLElement>("[data-review-quote]");
    const more = slide.querySelector<HTMLButtonElement>("[data-review-more]");
    quote?.classList.remove("is-expanded");
    if (!more) return;
    more.textContent = "Read more";
    more.setAttribute("aria-expanded", "false");
  };

  const onPrev = () => {
    collapseQuote(slides[index]);
    show(index - 1);
    stop();
    start();
  };

  const onNext = () => {
    collapseQuote(slides[index]);
    show(index + 1);
    stop();
    start();
  };

  const moreCleanups: Array<() => void> = [];

  const measureQuotes = () => {
    slides.forEach((slide) => {
      const quote = slide.querySelector<HTMLElement>("[data-review-quote]");
      const more = slide.querySelector<HTMLButtonElement>("[data-review-more]");
      if (!quote || !more || quote.classList.contains("is-expanded")) return;
      more.hidden = quote.scrollHeight <= quote.clientHeight + 1;
    });
  };

  slides.forEach((slide) => {
    const quote = slide.querySelector<HTMLElement>("[data-review-quote]");
    const more = slide.querySelector<HTMLButtonElement>("[data-review-more]");
    if (!quote || !more) return;

    const onMore = () => {
      const open = quote.classList.toggle("is-expanded");
      more.textContent = open ? "Show less" : "Read more";
      more.setAttribute("aria-expanded", String(open));
      if (open) stop();
      else start();
    };

    more.addEventListener("click", onMore);
    moreCleanups.push(() => more.removeEventListener("click", onMore));
  });

  measureQuotes();
  requestAnimationFrame(measureQuotes);
  void document.fonts?.ready.then(measureQuotes);

  slides.forEach((slide, i) => {
    const active = i === index;
    setSlideState(slide, active);
    if (!prefersReducedMotion()) {
      gsap.set(slide, { autoAlpha: active ? 1 : 0 });
    }
  });

  prevBtn?.addEventListener("click", onPrev);
  nextBtn?.addEventListener("click", onNext);
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  start();

  return () => {
    stop();
    moreCleanups.forEach((cleanup) => cleanup());
    prevBtn?.removeEventListener("click", onPrev);
    nextBtn?.removeEventListener("click", onNext);
    carousel.removeEventListener("mouseenter", stop);
    carousel.removeEventListener("mouseleave", start);
    gsap.killTweensOf(slides);
    slides.forEach((slide) => gsap.killTweensOf(slide.querySelectorAll("svg")));
    // autoAlpha leaves visibility:visible on the active slide. That punches
    // through the hidden reviews view and steals clicks on the dashboard.
    queueMicrotask(() => {
      gsap.set(slides, { clearProps: "opacity,visibility" });
    });
  };
});
