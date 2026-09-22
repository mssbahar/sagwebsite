/** Shared motion tokens — 363-aligned dashboard + inner motion */
export const MOTION = {
  panelSlide: 1.45,
  /** Inner page → dashboard (back navigation) */
  panelReturn: 0.58,
  panelEase: "power4.out",
  panelEnterDelay: 0.12,

  viewFade: 0.65,
  backdropFade: 0.85,
  microFade: 0.55,

  innerSwap: 1.2,

  revealY: 40,
  revealDuration: 1.0,
  revealEase: "power4.out",
  revealStagger: 0.2,
  revealThreshold: 0.5,
  aboveFoldLimit: 2,

  /** @deprecated use revealY */
  enterY: 40,
  /** @deprecated use revealDuration */
  enterDuration: 1.15,
  /** @deprecated use revealEase */
  enterEase: "power4.out",
  /** @deprecated use revealStagger */
  enterStagger: 0.16,

  tileStagger: 0.09,
  hoverDuration: 0.5,

  counterDuration: 2.0,
  counterStagger: 0.12,
} as const;
