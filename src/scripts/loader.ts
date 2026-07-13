import { gsap, prefersReducedMotion, registerGsap } from "./gsap-init";

function waitForWindowLoad() {
  if (document.readyState === "complete") return Promise.resolve();

  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function delay(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

export async function initSiteLoader() {
  const loader = document.getElementById("site-loader");
  const percent = loader?.querySelector<HTMLElement>("[data-loader-percent]");
  const logo = loader?.querySelector<HTMLElement>(".site-loader-logo");

  if (!loader || !percent || !logo) return;

  registerGsap();

  if (prefersReducedMotion()) {
    percent.textContent = "100";
    await waitForWindowLoad();
    loader.remove();
    return;
  }

  const progress = { value: 0 };
  const setProgress = () => {
    percent.textContent = String(Math.round(progress.value));
  };

  gsap.set(loader, { autoAlpha: 1 });
  gsap.fromTo(
    logo,
    { autoAlpha: 0, scale: 0.92 },
    { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power4.out" },
  );

  const progressTween = gsap.to(progress, {
    value: 87,
    duration: 1.35,
    ease: "power3.out",
    onUpdate: setProgress,
  });

  await Promise.all([waitForWindowLoad(), delay(1500)]);
  progressTween.kill();

  await new Promise<void>((resolve) => {
    gsap
      .timeline({ onComplete: resolve })
      .to(progress, {
        value: 100,
        duration: 0.36,
        ease: "power2.out",
        onUpdate: setProgress,
      })
      .to(
        logo,
        {
          autoAlpha: 0,
          scale: 1.08,
          duration: 0.42,
          ease: "power3.inOut",
        },
        "+=0.08",
      )
      .to(
        percent,
        {
          autoAlpha: 0,
          y: 8,
          duration: 0.32,
          ease: "power2.out",
        },
        "<",
      )
      .to(loader, {
        autoAlpha: 0,
        duration: 0.62,
        ease: "power3.inOut",
      });
  });

  loader.remove();
}
