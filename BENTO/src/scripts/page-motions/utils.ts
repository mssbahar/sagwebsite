import type { gsap as GsapType } from "gsap";
import { gsap, prefersReducedMotion } from "../gsap-init";

export type PageMotionModule = {
  init: (root: HTMLElement) => void;
  cleanup: () => void;
};

export function getViewRoot(view: string) {
  return document.querySelector<HTMLElement>(`[data-view="${view}"]`);
}

export function getScrollRoot(viewEl: HTMLElement) {
  return viewEl.querySelector<HTMLElement>("[data-scroll-root]") ?? viewEl;
}

export function createPageMotion(
  setup: (root: HTMLElement) => (() => void) | void,
): PageMotionModule {
  let context: ReturnType<GsapType["context"]> | null = null;
  let teardown: (() => void) | null = null;

  return {
    init(root) {
      context?.revert();
      teardown?.();
      teardown = null;

      if (prefersReducedMotion()) {
        teardown = setup(root) ?? null;
        return;
      }

      context = gsap.context(() => {
        teardown = setup(root) ?? null;
      }, root);
    },
    cleanup() {
      teardown?.();
      teardown = null;
      context?.revert();
      context = null;
    },
  };
}
