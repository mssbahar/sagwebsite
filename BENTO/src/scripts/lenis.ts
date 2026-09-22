import Lenis from "lenis";

let lenis: Lenis | null = null;

export function refreshLenis() {
  if (typeof window === "undefined") return;
  lenis?.resize();
  window.dispatchEvent(new CustomEvent("lenis:refresh"));
}

export function initLenis() {
  if (typeof window === "undefined") return;
  if (lenis) return;

  lenis = new Lenis({
    smoothWheel: true,
    prevent: (node) => {
      if (!(node instanceof HTMLElement)) return false;
      return node.closest("[data-lenis-prevent]") !== null;
    },
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  window.addEventListener("lenis:refresh", () => lenis?.resize());
}
