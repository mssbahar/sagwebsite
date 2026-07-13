import { gsap } from "../gsap-init";
import { MOTION } from "../motion";
import { createPageMotion, getScrollRoot } from "./utils";

type BranchContact = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  mapsUrl: string;
};

function applyBranch(root: HTMLElement, data: BranchContact) {
  const name = root.querySelector<HTMLElement>("[data-branch-name]");
  const address = root.querySelector<HTMLElement>("[data-branch-address]");
  const hours = root.querySelector<HTMLElement>("[data-branch-hours]");
  const phone = root.querySelector<HTMLAnchorElement>("[data-branch-phone]");
  const maps = root.querySelector<HTMLAnchorElement>("[data-branch-maps]");
  const contactPhone = root.querySelector<HTMLAnchorElement>("[data-contact-phone]");
  const contactHours = root.querySelector<HTMLElement>("[data-contact-hours]");

  if (name) name.textContent = data.name;
  if (address) address.textContent = data.address;
  if (hours) hours.textContent = data.hours;
  if (contactHours) contactHours.textContent = data.hours;
  if (phone) {
    phone.textContent = data.phone;
    phone.href = `tel:${data.phone.replace(/\s/g, "")}`;
  }
  if (contactPhone) {
    contactPhone.textContent = data.phone;
    contactPhone.href = `tel:${data.phone.replace(/\s/g, "")}`;
  }
  if (maps) {
    maps.href = data.mapsUrl;
    maps.toggleAttribute("hidden", !data.mapsUrl || data.mapsUrl === "#");
  }
}

export const contactMotion = createPageMotion((root) => {
  const scroller = getScrollRoot(root);
  const cleanups: Array<() => void> = [];

  const contactLayout = root.querySelector<HTMLElement>("[data-hq-contact]");
  let hq: BranchContact | null = null;
  try {
    hq = JSON.parse(contactLayout?.dataset.hqContact ?? "") as BranchContact;
  } catch {
    hq = null;
  }

  const select = root.querySelector<HTMLSelectElement>("[data-branch-picker]");
  const onBranchChange = () => {
    if (!select || !hq) return;
    if (select.value === "hq") {
      applyBranch(root, hq);
      return;
    }
    const option = select.selectedOptions[0];
    try {
      const branch = JSON.parse(option.dataset.branch ?? "") as BranchContact & { name: string };
      applyBranch(root, {
        name: `Smart Autocare Garage — ${branch.name}`,
        address: branch.address,
        hours: branch.hours,
        phone: branch.phone,
        mapsUrl: branch.mapsUrl,
      });
    } catch {
      applyBranch(root, hq);
    }
  };
  select?.addEventListener("change", onBranchChange);
  cleanups.push(() => select?.removeEventListener("change", onBranchChange));

  const ctaBg = root.querySelector<HTMLElement>("[data-contact-cta-bg]");
  if (ctaBg) {
    gsap.fromTo(
      ctaBg,
      { scale: 1 },
      {
        scale: 1.06,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      },
    );
  }

  const cards = [...root.querySelectorAll<HTMLElement>("[data-contact-card]")];
  cards.forEach((card, i) => {
    gsap.fromTo(
      card,
      { autoAlpha: 0, y: 20, immediateRender: false },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        delay: i * 0.1,
        ease: MOTION.panelEase,
        scrollTrigger: {
          trigger: card,
          scroller,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  return () => cleanups.forEach((fn) => fn());
});
