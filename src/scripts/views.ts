import { gsap, prefersReducedMotion, registerGsap } from "./gsap-init";
import { MOTION } from "./motion";
import { resetViewReveals, setupInnerViewReveals, primeInnerPanelContent } from "./reveals";
import { refreshLenis } from "./lenis";

type ViewName = string;

const ROOT_VIEWS = new Set<ViewName>(["landing", "dashboard"]);

function isInnerView(view: ViewName) {
  return !ROOT_VIEWS.has(view);
}

function needsOverlayTransition(from: ViewName, to: ViewName) {
  if (isInnerView(from) || isInnerView(to)) return true;
  if (to === "dashboard" && from !== "landing") return true;
  return false;
}

const views = new Map<ViewName, HTMLElement>();
let current: ViewName = "landing";
let animating = false;
let heroIntroPlayed = false;
let dashboardOpen = false;
let dashboardGen = 0;
let dashboardTl: gsap.core.Timeline | null = null;
let overlayGen = 0;
let overlayTl: gsap.core.Timeline | null = null;

function killDashboardTimeline() {
  if (dashboardTl) {
    dashboardTl.eventCallback("onComplete", null);
    dashboardTl.kill();
  }
  dashboardTl = null;
  dashboardGen++;
}

function killOverlayTimeline() {
  if (overlayTl) {
    overlayTl.eventCallback("onComplete", null);
    overlayTl.kill();
  }
  overlayTl = null;
  overlayGen++;
}

function getInnerPanel(viewEl: HTMLElement) {
  return viewEl.querySelector<HTMLElement>("[data-inner-panel]");
}

function sharedBackdrop() {
  return document.getElementById("overlay-backdrop");
}

function showSharedBackdrop(animate = true, timeline?: gsap.core.Timeline) {
  const backdrop = sharedBackdrop();
  if (!backdrop) return;

  const opacity = Number(gsap.getProperty(backdrop, "opacity") ?? 0);
  if (opacity > 0.9 && !timeline) {
    gsap.set(backdrop, { opacity: 1 });
    return;
  }

  gsap.killTweensOf(backdrop);
  if (timeline && animate && !prefersReducedMotion()) {
    gsap.set(backdrop, { opacity: 0 });
    timeline.to(
      backdrop,
      { opacity: 1, duration: MOTION.backdropFade, ease: "none" },
      0,
    );
    return;
  }

  if (animate && !prefersReducedMotion()) {
    gsap.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: MOTION.backdropFade, ease: "none" },
    );
  } else {
    gsap.set(backdrop, { opacity: 1 });
  }
}

function hideSharedBackdrop() {
  const backdrop = sharedBackdrop();
  if (backdrop) gsap.set(backdrop, { opacity: 0 });
}

function dockDashboardCta() {
  setNavCtaMode("close");
  dockNavCta("dashboard");
  document.getElementById("explore-close-wrap")!.style.display = "";
}

function dockInnerCta(view: ViewName) {
  setNavCtaMode("back");
  dockNavCta(view);
  document.getElementById("explore-close-wrap")!.style.display = "";
}

function settlePanel(panel: HTMLElement) {
  gsap.set(panel, {
    visibility: "visible",
    opacity: 1,
    y: 0,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  });
}

function resetInnerPanel(viewEl: HTMLElement) {
  const panel = getInnerPanel(viewEl);
  if (panel) settlePanel(panel);
}

function preparePanelEnter(panel: HTMLElement, opts?: { clipOnly?: boolean }) {
  gsap.killTweensOf(panel);
  gsap.set(panel, {
    visibility: "visible",
    opacity: opts?.clipOnly ? 1 : 0,
    y: 0,
    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  });
}

function preparePanelExit(panel: HTMLElement) {
  gsap.killTweensOf(panel);
  gsap.set(panel, { y: 0 });
}

function addPanelEnter(
  tl: gsap.core.Timeline,
  panel: HTMLElement,
  dur: number,
  position = 0,
  opts?: { clipOnly?: boolean },
) {
  if (opts?.clipOnly) {
    tl.to(
      panel,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: dur,
        ease: MOTION.panelEase,
        onComplete: () => settlePanel(panel),
      },
      position,
    );
    return;
  }

  tl.to(
    panel,
    {
      opacity: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: dur,
      ease: MOTION.panelEase,
      onComplete: () => settlePanel(panel),
    },
    position,
  );
}

function addPanelExit(
  tl: gsap.core.Timeline,
  panel: HTMLElement,
  dur: number,
  position = 0,
) {
  tl.to(
    panel,
    {
      opacity: 0,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      duration: dur,
      ease: MOTION.panelEase,
    },
    position,
  );
}

function snapDashboardTiles(dash: HTMLElement) {
  const tiles = dash.querySelectorAll<HTMLElement>("[data-dashboard-tile]");
  if (!tiles.length) return;
  gsap.set(tiles, { autoAlpha: 1, y: 0, scale: 1 });
}

function cascadeDashboardTiles(
  tl: gsap.core.Timeline,
  dash: HTMLElement,
  startAt: number,
) {
  const tiles = dash.querySelectorAll<HTMLElement>("[data-dashboard-tile]");
  if (!tiles.length) return;

  if (prefersReducedMotion()) {
    gsap.set(tiles, { autoAlpha: 1, y: 0, scale: 1 });
    return;
  }

  gsap.set(tiles, { autoAlpha: 0, y: 24, scale: 0.96 });
  tl.to(
    tiles,
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: MOTION.tileStagger,
      ease: MOTION.panelEase,
    },
    startAt,
  );
}

function dispatchLeave(from: ViewName) {
  document.dispatchEvent(new CustomEvent("view:leave", { detail: from }));
}

function hideView(el: HTMLElement) {
  gsap.set(el, { autoAlpha: 0 });
  el.style.visibility = "hidden";
  el.style.pointerEvents = "none";
  el.style.zIndex = "";
}

function showView(el: HTMLElement, opts?: { behind?: boolean }) {
  el.style.visibility = "visible";
  el.style.pointerEvents = opts?.behind ? "none" : "auto";
  gsap.set(el, { autoAlpha: 1 });
}

function syncViewLayering(active: ViewName) {
  for (const [name, el] of views) {
    if (name === active) {
      el.style.zIndex = "20";
      showView(el);
      continue;
    }

    if (name === "landing" && active !== "landing") {
      el.style.zIndex = "10";
      showView(el, { behind: true });
      continue;
    }

    hideView(el);
  }
}

function setViewStackOrder(active: HTMLElement, behind?: HTMLElement) {
  active.style.zIndex = "25";
  active.style.pointerEvents = "auto";
  if (behind) {
    behind.style.zIndex = "20";
    behind.style.pointerEvents = "none";
  }
}

function getDashboardPanel() {
  return views
    .get("dashboard")
    ?.querySelector<HTMLElement>("[data-dashboard-panel]");
}

const LANDING_WRAP =
  "explore-close-wrap explore-close-wrap--landing explore-close-wrap--pill fixed inset-x-0 bottom-0 z-[60] flex w-full justify-center px-3 pb-[calc(0.65rem+env(safe-area-inset-bottom))] md:inset-x-auto md:bottom-10 md:left-1/2 md:w-auto md:px-0 md:pb-0 md:-translate-x-1/2";
const DOCKED_WRAP =
  "explore-close-wrap explore-close-wrap--docked explore-close-wrap--pill relative z-10 flex w-full shrink-0 justify-center px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:px-4 md:pb-6";

type NavCtaMode = "explore" | "close" | "back";

function dockNavCta(view: ViewName) {
  const wrap = document.getElementById("explore-close-wrap");
  const app = document.getElementById("app");
  if (!wrap || !app) return;

  if (view === "dashboard") {
    const anchor = document.querySelector("[data-explore-close-anchor]");
    if (anchor) {
      anchor.appendChild(wrap);
      wrap.className = DOCKED_WRAP;
      return;
    }
  }

  if (isInnerView(view)) {
    const viewEl = views.get(view);
    const anchor = viewEl?.querySelector("[data-inner-close-anchor]");
    if (anchor) {
      anchor.appendChild(wrap);
      wrap.className = `${DOCKED_WRAP} inner-page-cta-wrap`;
      return;
    }
  }

  app.appendChild(wrap);
  wrap.className = LANDING_WRAP;
}

function setNavCtaMode(mode: NavCtaMode) {
  const wrap = document.getElementById("explore-close-wrap");
  const btn = document.querySelector<HTMLButtonElement>("[data-explore-close]");
  const open = wrap?.querySelector<HTMLElement>("[data-explore-open]");
  const close = wrap?.querySelector<HTMLElement>("[data-explore-close-label]");
  const back = wrap?.querySelector<HTMLElement>("[data-explore-back-label]");
  if (!btn || !open || !close || !back) return;

  // Keep existing show/hide behavior for assistive tech fallback.
  open.toggleAttribute("hidden", mode !== "explore");
  close.toggleAttribute("hidden", mode !== "close");
  back.toggleAttribute("hidden", mode !== "back");

  // Drive 363-style morph via data-state.
  btn.setAttribute("data-state", mode);

  const labels: Record<NavCtaMode, string> = {
    explore: "Explore dashboard",
    close: "Close dashboard",
    back: "Back to dashboard",
  };
  btn.setAttribute("aria-label", labels[mode]);
}

function updateExploreClose(view: ViewName, opts?: { dock?: boolean }) {
  const wrap = document.getElementById("explore-close-wrap");
  if (!wrap) return;

  const show = view === "landing" || view === "dashboard" || isInnerView(view);
  wrap.style.display = show ? "" : "none";

  if (view === "landing") setNavCtaMode("explore");
  else if (view === "dashboard") setNavCtaMode("close");
  else if (isInnerView(view)) setNavCtaMode("back");

  if (opts?.dock !== false) dockNavCta(view);
}

function animateHero() {
  const landing = views.get("landing");
  if (!landing) return;

  const items = landing.querySelectorAll<HTMLElement>(".hero-item");
  gsap.killTweensOf(items);

  if (prefersReducedMotion() || heroIntroPlayed) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }

  heroIntroPlayed = true;
  gsap.fromTo(
    items,
    { opacity: 0, y: MOTION.enterY, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: MOTION.enterDuration,
      stagger: MOTION.enterStagger,
      ease: MOTION.enterEase,
      delay: 0.15,
      overwrite: true,
    },
  );
}

function toggleLandingVideo(view: ViewName) {
  const video = document.querySelector<HTMLVideoElement>(
    '[data-view="landing"] video',
  );
  if (!video) return;

  const reduce = prefersReducedMotion();
  if (view === "landing") {
    gsap.killTweensOf(video);
    if (reduce) {
      gsap.set(video, { filter: "blur(0px)", scale: 1.04 });
    } else {
      gsap.to(video, {
        filter: "blur(0px)",
        scale: 1.04,
        duration: MOTION.microFade,
        ease: "none",
        onComplete: () => video.play?.().catch(() => {}),
      });
    }
    if (reduce) video.play?.().catch(() => {});
    return;
  }

  video.pause?.();
  gsap.killTweensOf(video);
  if (reduce) {
    gsap.set(video, { filter: "blur(10px)", scale: 1.12 });
    return;
  }
  gsap.to(video, {
    filter: "blur(10px)",
    scale: 1.12,
    duration: MOTION.backdropFade,
    ease: MOTION.panelEase,
  });
}

function onEnter(view: ViewName) {
  document.documentElement.dataset.appView = view;
  updateExploreClose(view);
  if (view === "landing") animateHero();
  document.dispatchEvent(new CustomEvent("view:enter", { detail: view }));
}

function openDashboard(instant = false) {
  const dash = views.get("dashboard");
  const landing = views.get("landing");
  const panel = getDashboardPanel();
  if (!dash || !panel) {
    animating = false;
    return;
  }

  killDashboardTimeline();
  killOverlayTimeline();
  const gen = dashboardGen;
  dashboardOpen = true;

  const reduce = prefersReducedMotion() || instant;
  const dur = reduce ? 0 : MOTION.panelSlide;

  if (landing) {
    landing.style.zIndex = "10";
    showView(landing, { behind: true });
  }

  dash.style.zIndex = "20";
  showView(dash);
  toggleLandingVideo("dashboard");
  dockDashboardCta();

  if (reduce) {
    showSharedBackdrop(false);
    gsap.set(panel, { visibility: "visible", opacity: 1, y: 0 });
    const tiles = dash.querySelectorAll<HTMLElement>("[data-dashboard-tile]");
    gsap.set(tiles, { autoAlpha: 1, y: 0, scale: 1 });
    current = "dashboard";
    animating = false;
    syncViewLayering("dashboard");
    onEnter("dashboard");
    return;
  }

  preparePanelEnter(panel);
  const backdrop = sharedBackdrop();
  if (backdrop) gsap.set(backdrop, { opacity: 0 });

  dashboardTl = gsap.timeline({
    defaults: { ease: MOTION.panelEase, overwrite: true },
    onComplete: () => {
      if (gen !== dashboardGen) return;
      settlePanel(panel);
      current = "dashboard";
      animating = false;
      syncViewLayering("dashboard");
      onEnter("dashboard");
    },
  });

  showSharedBackdrop(true, dashboardTl);
  addPanelEnter(dashboardTl, panel, dur, MOTION.panelEnterDelay);
  cascadeDashboardTiles(dashboardTl, dash, MOTION.panelEnterDelay + dur * 0.55);
}

function closeDashboard(instant = false) {
  const dash = views.get("dashboard");
  const panel = getDashboardPanel();
  if (!dash || !panel) {
    animating = false;
    return;
  }

  killDashboardTimeline();
  killOverlayTimeline();
  const gen = dashboardGen;

  const reduce = prefersReducedMotion() || instant;
  const dur = reduce ? 0 : MOTION.panelSlide;

  toggleLandingVideo("landing");

  if (reduce) {
    dashboardOpen = false;
    gsap.set(dash, { autoAlpha: 0 });
    hideView(dash);
    gsap.set(panel, { visibility: "hidden", opacity: 0, y: 0 });
    hideSharedBackdrop();
    setNavCtaMode("explore");
    dockNavCta("landing");
    current = "landing";
    animating = false;
    syncViewLayering("landing");
    onEnter("landing");
    return;
  }

  preparePanelExit(panel);

  dashboardTl = gsap.timeline({
    defaults: { ease: MOTION.panelEase, overwrite: true },
    onComplete: () => {
      if (gen !== dashboardGen) return;
      dashboardOpen = false;
      gsap.set(panel, { clearProps: "transform" });
      hideView(dash);
      gsap.set(panel, {
        visibility: "hidden",
        opacity: 0,
        y: 0,
        clearProps: "transform",
      });
      hideSharedBackdrop();
      setNavCtaMode("explore");
      dockNavCta("landing");
      current = "landing";
      animating = false;
      syncViewLayering("landing");
      onEnter("landing");
    },
  });

  addPanelExit(dashboardTl, panel, dur);
  dashboardTl.call(
    () => {
      setNavCtaMode("explore");
      dockNavCta("landing");
    },
    undefined,
    dur * 0.72,
  );
}

function toggleDashboard() {
  if (animating) return;

  const shouldClose = current === "dashboard";
  const target: ViewName = shouldClose ? "landing" : "dashboard";
  dispatchLeave(current);
  animating = true;
  const hash = target === "landing" ? " " : `#${target}`;
  history.pushState(
    { view: target },
    "",
    target === "landing" ? location.pathname : hash,
  );

  if (target === "dashboard") openDashboard();
  else closeDashboard();
}

function finishOverlayTransition(
  from: ViewName,
  to: ViewName,
  fromEl: HTMLElement | undefined,
  toEl: HTMLElement,
) {
  if (to === "landing") {
    hideSharedBackdrop();
    dashboardOpen = false;
    const dashPanel = getDashboardPanel();
    if (dashPanel)
      gsap.set(dashPanel, { visibility: "hidden", opacity: 0, y: 0 });
  }

  if (to === "dashboard") {
    const panel = getDashboardPanel();
    if (panel) settlePanel(panel);
  }

  if (isInnerView(to)) {
    const panel = getInnerPanel(toEl);
    if (panel) settlePanel(panel);
  }

  if (fromEl && fromEl !== toEl) {
    if (isInnerView(from)) {
      resetInnerPanel(fromEl);
      resetViewReveals(fromEl);
    }
    hideView(fromEl);
  }

  current = to;
  animating = false;
  syncViewLayering(to);
  if (isInnerView(to)) setupInnerViewReveals(toEl);
  else refreshLenis();
  onEnter(to);
}

function transitionOverlay(from: ViewName, to: ViewName, instant = false) {
  const fromEl = views.get(from);
  const toEl = views.get(to);
  if (!toEl) {
    animating = false;
    return;
  }

  killOverlayTimeline();
  const gen = overlayGen;

  const reduce = prefersReducedMotion() || instant;
  const innerToInner = isInnerView(from) && isInnerView(to);
  const returningToDashboard = to === "dashboard" && isInnerView(from);
  const dur = reduce
    ? 0
    : returningToDashboard
      ? MOTION.panelReturn
      : innerToInner
        ? MOTION.innerSwap
        : MOTION.panelSlide;

  const toPanel = isInnerView(to) ? getInnerPanel(toEl) : null;
  const fromPanel = fromEl && isInnerView(from) ? getInnerPanel(fromEl) : null;
  const fromDashPanel = from === "dashboard" ? getDashboardPanel() : null;
  const toDashPanel = to === "dashboard" ? getDashboardPanel() : null;
  const dash = views.get("dashboard");

  const scroller = toEl.querySelector<HTMLElement>("[data-scroll-root]");
  if (scroller) scroller.scrollTop = 0;

  toggleLandingVideo(to === "landing" ? "landing" : "dashboard");

  const landing = views.get("landing");
  if (to !== "landing" && landing) {
    landing.style.zIndex = "10";
    showView(landing, { behind: true });
  }

  if (dashboardOpen && dash && !innerToInner) {
    dash.style.zIndex = returningToDashboard ? "25" : "20";
    showView(dash);
  } else if (dash && innerToInner) {
    hideView(dash);
  }

  if (isInnerView(to)) dashboardOpen = true;
  if (to === "landing") dashboardOpen = false;

  if (to === "dashboard") {
    toEl.style.zIndex = "25";
    showView(toEl);
  } else if (isInnerView(to)) {
    toEl.style.zIndex = "25";
    showView(toEl);
  } else {
    showView(toEl);
  }

  if (to === "landing") {
    hideSharedBackdrop();
  } else if (isInnerView(to)) {
    // Inner pages need the backdrop even on instant/hash reload — otherwise the
    // landing hero bleeds through the glass panel when the dashboard shell is empty.
    if (reduce) showSharedBackdrop(false);
  } else if (to !== "landing" && !innerToInner) {
    const backdrop = sharedBackdrop();
    if (backdrop) gsap.set(backdrop, { opacity: 0 });
  } else if (to !== "landing") {
    showSharedBackdrop(!innerToInner);
  }

  if (isInnerView(to)) {
    dockInnerCta(to);
  } else if (to === "dashboard") {
    dockDashboardCta();
  }

  if (reduce) {
    if (fromPanel) gsap.set(fromPanel, { opacity: 0, y: 0 });
    if (fromDashPanel) gsap.set(fromDashPanel, { opacity: 0, y: 0 });
    if (isInnerView(to)) primeInnerPanelContent(toEl);
    if (toPanel) gsap.set(toPanel, { visibility: "visible", opacity: 1, y: 0 });
    if (toDashPanel)
      gsap.set(toDashPanel, { visibility: "visible", opacity: 1, y: 0 });
    finishOverlayTransition(from, to, fromEl, toEl);
    return;
  }

  if (returningToDashboard && fromEl) {
    fromEl.style.pointerEvents = "none";
  }

  if (innerToInner && fromEl) {
    fromEl.style.pointerEvents = "none";
    setViewStackOrder(toEl, fromEl);
  } else if (returningToDashboard && dash && fromEl) {
    setViewStackOrder(dash, fromEl);
  } else if (isInnerView(to) && fromEl) {
    setViewStackOrder(toEl, fromEl);
  }

  if (isInnerView(to)) primeInnerPanelContent(toEl);
  if (toPanel) preparePanelEnter(toPanel, { clipOnly: true });
  if (toDashPanel) preparePanelEnter(toDashPanel);
  if (!returningToDashboard && !innerToInner && fromPanel)
    preparePanelExit(fromPanel);
  if (fromDashPanel) preparePanelExit(fromDashPanel);

  overlayTl = gsap.timeline({
    defaults: { ease: MOTION.panelEase, overwrite: true },
    onComplete: () => {
      if (gen !== overlayGen) return;
      finishOverlayTransition(from, to, fromEl, toEl);
    },
  });

  if (innerToInner && fromEl && toPanel) {
    overlayTl.to(
      fromEl,
      { autoAlpha: 0, duration: dur * 0.72, ease: MOTION.panelEase },
      0,
    );
    addPanelEnter(overlayTl, toPanel, dur, 0, { clipOnly: true });
  } else if (returningToDashboard && fromEl) {
    overlayTl.to(
      fromEl,
      { autoAlpha: 0, duration: dur * 0.55, ease: "power2.inOut" },
      0,
    );
    if (toDashPanel) {
      showSharedBackdrop(true, overlayTl);
      addPanelEnter(overlayTl, toDashPanel, dur * 0.92, 0);
      if (dash) snapDashboardTiles(dash);
    }
  } else {
    if (!innerToInner && to !== "landing") {
      showSharedBackdrop(true, overlayTl);
    }
    const panelDelay = innerToInner ? 0 : MOTION.panelEnterDelay;
    if (fromPanel) addPanelExit(overlayTl, fromPanel, dur, 0);
    if (fromDashPanel) addPanelExit(overlayTl, fromDashPanel, dur, 0);
    if (toPanel) addPanelEnter(overlayTl, toPanel, dur, panelDelay, { clipOnly: true });
    if (toDashPanel) {
      addPanelEnter(overlayTl, toDashPanel, dur, panelDelay);
      if (dash) cascadeDashboardTiles(overlayTl, dash, panelDelay + dur * 0.55);
    }
  }
}

function setActive(view: ViewName, instant = false) {
  if (view === "dashboard" && !dashboardOpen) {
    openDashboard(instant);
    return;
  }

  if (view === "landing" && dashboardOpen && current === "dashboard") {
    closeDashboard(instant);
    return;
  }

  if (needsOverlayTransition(current, view)) {
    transitionOverlay(current, view, instant);
    return;
  }

  const to = views.get(view);
  if (!to) return;
  const from = views.get(current);

  to.scrollTop = 0;
  const scroller = to.querySelector<HTMLElement>("[data-scroll-root]");
  if (scroller) scroller.scrollTop = 0;

  toggleLandingVideo(view);

  const reduce = prefersReducedMotion() || instant;
  const dur = reduce ? 0 : MOTION.viewFade;

  const landing = views.get("landing");
  if (view !== "landing" && landing) {
    landing.style.visibility = "visible";
    gsap.set(landing, { autoAlpha: 1 });
  }

  if (from && from !== to && current !== "landing") {
    gsap.killTweensOf(from);
    gsap.to(from, {
      autoAlpha: 0,
      duration: dur,
      onComplete: () => {
        from.style.visibility = "hidden";
      },
    });
  }

  gsap.killTweensOf(to);
  gsap.fromTo(
    to,
    { autoAlpha: view === "landing" ? 1 : 0 },
    {
      autoAlpha: 1,
      duration: dur,
      onStart: () => {
        to.style.visibility = "visible";
      },
      onComplete: () => {
        animating = false;
        onEnter(view);
      },
    },
  );

  current = view;
}

export function navigate(view: ViewName) {
  if (!views.has(view)) return;
  if (animating) return;

  const from = current;
  if (view !== from) dispatchLeave(from);

  if (view === "dashboard" && !dashboardOpen) {
    animating = true;
    history.pushState({ view }, "", `#${view}`);
    openDashboard();
    return;
  }

  if (view === "landing" && dashboardOpen) {
    animating = true;
    history.pushState({ view }, "", location.pathname);
    if (isInnerView(current)) transitionOverlay(current, "landing");
    else closeDashboard();
    return;
  }

  if (needsOverlayTransition(current, view)) {
    if (view === current) return;
    animating = true;
    const hash = view === "landing" ? " " : `#${view}`;
    history.pushState(
      { view },
      "",
      view === "landing" ? location.pathname : hash,
    );
    setActive(view);
    return;
  }

  if (view === current) return;
  animating = true;
  const hash = view === "landing" ? " " : `#${view}`;
  history.pushState(
    { view },
    "",
    view === "landing" ? location.pathname : hash,
  );
  setActive(view);
}

export function initViews() {
  registerGsap();
  document.documentElement.dataset.appView = "landing";

  document.querySelectorAll<HTMLElement>("[data-view]").forEach((el) => {
    views.set(el.dataset.view as ViewName, el);
  });

  hideSharedBackdrop();
  syncViewLayering("landing");

  const panel = getDashboardPanel();
  if (panel) gsap.set(panel, { visibility: "hidden", opacity: 0, y: 0 });

  document
    .querySelector<HTMLButtonElement>("[data-explore-close]")
    ?.addEventListener("click", () => {
      if (animating) return;
      if (isInnerView(current)) {
        navigate("dashboard");
        return;
      }
      toggleDashboard();
    });

  document.querySelectorAll<HTMLElement>("[data-nav-to]").forEach((el) => {
    if (el.hasAttribute("data-explore-close")) return;
    el.addEventListener("click", (event) => {
      if (el.tagName !== "A") event.preventDefault();
      navigate(el.dataset.navTo as ViewName);
    });
    el.addEventListener("keydown", (event) => {
      if (
        el.getAttribute("role") === "button" &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        navigate(el.dataset.navTo as ViewName);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (current === "landing") return;
    navigate(current === "dashboard" ? "landing" : "dashboard");
  });

  window.addEventListener("popstate", (event) => {
    const view =
      (event.state?.view as ViewName) ||
      location.hash.replace("#", "") ||
      "landing";
    if (views.has(view) && view !== current) {
      dispatchLeave(current);
      animating = true;
      setActive(view);
    }
  });

  const initial = location.hash.replace("#", "") || "landing";
  const start = views.has(initial) ? initial : "landing";

  if (start === "dashboard") {
    animating = true;
    openDashboard(true);
  } else if (isInnerView(start)) {
    animating = true;
    dashboardOpen = true;
    const dash = views.get("dashboard");
    if (dash) {
      dash.style.visibility = "visible";
      gsap.set(dash, { autoAlpha: 1 });
      const panel = getDashboardPanel();
      if (panel) gsap.set(panel, { visibility: "hidden", opacity: 0, y: 0 });
    }
    transitionOverlay("dashboard", start, true);
    delete document.documentElement.dataset.hashInner;
  } else {
    animating = true;
    setActive(start, true);
  }
}
