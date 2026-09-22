import { prefersReducedMotion } from "./gsap-init";

export function initCarousel(rootSelector = "[data-carousel]") {
  const root = document.querySelector<HTMLElement>(rootSelector);
  if (!root) return;

  const slides = root.querySelectorAll<HTMLElement>("[data-carousel-slide]");
  const dots = root.querySelectorAll<HTMLElement>("[data-carousel-dot]");
  if (slides.length <= 1) return;

  let index = 0;
  let timer: number | undefined;

  const show = (next: number) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== index;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("bg-accent", i === index);
      dot.classList.toggle("w-6", i === index);
      dot.classList.toggle("bg-white/25", i !== index);
      dot.classList.toggle("w-2", i !== index);
      dot.setAttribute("aria-selected", String(i === index));
    });
  };

  const start = () => {
    if (prefersReducedMotion()) return;
    timer = window.setInterval(() => show(index + 1), 6000);
  };
  const stop = () => {
    if (timer) window.clearInterval(timer);
  };

  dots.forEach((dot, i) => dot.addEventListener("click", () => { show(i); stop(); start(); }));
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  show(0);
  start();
}
