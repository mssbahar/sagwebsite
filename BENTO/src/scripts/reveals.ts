import { gsap, prefersReducedMotion } from "./gsap-init";
import { refreshLenis } from "./lenis";
import { MOTION } from "./motion";

const REVEAL_SELECTOR = ".reveal, .reveal-fade, .reveal-image";

const counterStates = new WeakMap<HTMLElement, { value: number }>();
const scrollObservers = new WeakMap<HTMLElement, IntersectionObserver>();

function getRevealElements(viewEl: HTMLElement) {
  return [...viewEl.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)];
}

function isRevealHidden(el: HTMLElement) {
  return Number(gsap.getProperty(el, "opacity")) < 0.99;
}

function setRevealHidden(el: HTMLElement) {
  gsap.killTweensOf(el);
  if (el.classList.contains("reveal-image")) {
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      return;
    }
    gsap.set(el, { opacity: 0, y: 0, scale: 1.05 });
    return;
  }
  if (el.classList.contains("reveal-fade")) {
    if (prefersReducedMotion()) gsap.set(el, { opacity: 1, y: 0 });
    else gsap.set(el, { opacity: 0, y: 0 });
    return;
  }
  if (prefersReducedMotion()) gsap.set(el, { opacity: 1, y: 0 });
  else gsap.set(el, { opacity: 0, y: MOTION.revealY });
}

function runCounter(el: HTMLElement) {
  const raw = el.dataset.counter ?? "0";
  const suffix = el.dataset.suffix ?? "";
  const isNumeric = el.dataset.numeric === "true";

  if (!isNumeric) {
    el.textContent = `${raw}${suffix}`;
    return;
  }

  const target = Number(raw);
  if (prefersReducedMotion()) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  const state = counterStates.get(el) ?? { value: 0 };
  counterStates.set(el, state);
  gsap.killTweensOf(state);
  state.value = 0;
  el.textContent = `0${suffix}`;

  gsap.to(state, {
    value: target,
    duration: MOTION.counterDuration,
    ease: MOTION.revealEase,
    snap: { value: 1 },
    overwrite: true,
    onUpdate: () => {
      el.textContent = `${Math.round(state.value).toLocaleString()}${suffix}`;
    },
  });
}

function revealEl(el: HTMLElement, duration = MOTION.revealDuration) {
  gsap.killTweensOf(el);
  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  if (el.classList.contains("reveal-fade")) {
    gsap.to(el, {
      opacity: 1,
      duration,
      ease: "none",
      overwrite: true,
    });
    return;
  }

  if (el.classList.contains("reveal-image")) {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration,
      ease: MOTION.revealEase,
      overwrite: true,
    });
    return;
  }

  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration,
    ease: MOTION.revealEase,
    overwrite: true,
  });
}

export function resetViewReveals(viewEl: HTMLElement) {
  scrollObservers.get(viewEl)?.disconnect();
  scrollObservers.delete(viewEl);
  getRevealElements(viewEl).forEach(setRevealHidden);
}

export function getAboveFoldReveals(viewEl: HTMLElement, limit = MOTION.aboveFoldLimit) {
  const scroller =
    viewEl.querySelector<HTMLElement>("[data-scroll-root]") ?? viewEl;
  const reveals = getRevealElements(viewEl);
  if (!reveals.length) return [];

  const rootRect = scroller.getBoundingClientRect();
  const visible = reveals.filter((el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < rootRect.bottom && rect.bottom > rootRect.top;
  });

  return (visible.length ? visible : reveals).slice(0, limit);
}

function revealAboveFold(viewEl: HTMLElement) {
  const above = getAboveFoldReveals(viewEl);
  if (!above.length) return;

  if (prefersReducedMotion()) {
    above.forEach((el) => revealEl(el, 0));
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: MOTION.revealEase, overwrite: true } });
  above.forEach((el, i) => {
    if (el.dataset.counter !== undefined) {
      tl.call(() => runCounter(el), undefined, i * MOTION.revealStagger);
      return;
    }
    if (el.classList.contains("reveal-fade")) {
      tl.to(el, { opacity: 1, duration: MOTION.microFade, ease: "none" }, i * MOTION.revealStagger);
      return;
    }
    if (el.classList.contains("reveal-image")) {
      tl.fromTo(
        el,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: MOTION.revealDuration },
        i * MOTION.revealStagger,
      );
      return;
    }
    tl.fromTo(
      el,
      { opacity: 0, y: MOTION.revealY },
      { opacity: 1, y: 0, duration: MOTION.revealDuration },
      i * MOTION.revealStagger,
    );
  });
}

export function bindScrollReveals(viewEl: HTMLElement) {
  scrollObservers.get(viewEl)?.disconnect();

  const scroller =
    viewEl.querySelector<HTMLElement>("[data-scroll-root]") ?? viewEl;
  const pending = getRevealElements(viewEl).filter(isRevealHidden);

  if (!pending.length || prefersReducedMotion()) {
    pending.forEach((el) => revealEl(el, 0));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        if (el.dataset.counter !== undefined) runCounter(el);
        else revealEl(el);
        observer.unobserve(el);
      });
    },
    { root: scroller, threshold: MOTION.revealThreshold },
  );

  pending.forEach((el) => observer.observe(el));
  scrollObservers.set(viewEl, observer);
}

export function setupViewReveals(viewEl: HTMLElement) {
  resetViewReveals(viewEl);
  revealAboveFold(viewEl);
  bindScrollReveals(viewEl);
  refreshLenis();
}

/** Inner pages: above-fold content rides with the panel clip — no second fade. */
export function primeInnerPanelContent(viewEl: HTMLElement) {
  scrollObservers.get(viewEl)?.disconnect();
  scrollObservers.delete(viewEl);

  const above = getAboveFoldReveals(viewEl);
  const aboveSet = new Set(above);

  getRevealElements(viewEl).forEach((el) => {
    if (aboveSet.has(el)) {
      if (el.dataset.counter !== undefined) runCounter(el);
      else revealEl(el, 0);
      return;
    }
    setRevealHidden(el);
  });
}

export function setupInnerViewReveals(viewEl: HTMLElement) {
  bindScrollReveals(viewEl);
  refreshLenis();
}

function initDashboardCounters() {
  const dash = document.querySelector<HTMLElement>('[data-view="dashboard"]');
  if (!dash) return;

  dash.querySelectorAll<HTMLElement>("[data-counter]").forEach((el, i) => {
    window.setTimeout(() => runCounter(el), i * MOTION.counterStagger * 1000);
  });
}

export function initReveals() {
  document.addEventListener("view:enter", (event) => {
    const name = (event as CustomEvent<string>).detail;
    if (name === "dashboard") initDashboardCounters();
    refreshLenis();
  });
}
