import type { PageMotionModule } from "./utils";
import { getViewRoot } from "./utils";
import { aboutMotion } from "./about";
import { servicesMotion } from "./services";
import { locationsMotion } from "./locations-map";
import { reviewsMotion } from "./reviews";
import { workshopMotion } from "./workshop";
import { contactMotion } from "./contact";
import { promotionsMotion } from "./promotions";
import { dashboardMotion, landingMotion } from "./landing-dashboard";

const PAGE_MOTIONS: Record<string, PageMotionModule> = {
  landing: landingMotion,
  dashboard: dashboardMotion,
  about: aboutMotion,
  services: servicesMotion,
  locations: locationsMotion,
  reviews: reviewsMotion,
  workshop: workshopMotion,
  contact: contactMotion,
  promotions: promotionsMotion,
};

let activeView: string | null = null;

function cleanupActive() {
  if (!activeView) return;
  PAGE_MOTIONS[activeView]?.cleanup();
  activeView = null;
}

function initView(view: string) {
  cleanupActive();
  const root = getViewRoot(view);
  const motion = PAGE_MOTIONS[view];
  if (!root || !motion) return;
  activeView = view;
  motion.init(root);
}

export function initPageMotions() {
  document.addEventListener("view:enter", (event) => {
    const view = (event as CustomEvent<string>).detail;
    const run = () => initView(view);
    // Let inner panel settle before scroll-triggered page motions attach.
    if (view !== "landing" && view !== "dashboard") {
      requestAnimationFrame(run);
      return;
    }
    run();
  });

  document.addEventListener("view:leave", () => {
    cleanupActive();
  });
}

/** Re-attach motion for the current view (e.g. after initViews). */
export function syncActivePageMotion() {
  const current = document.documentElement.dataset.appView;
  if (current) initView(current);
}
