export const promotionsHero = {
  eyebrow: "Current offers",
  headline: "Promotions that keep you moving",
  intro:
    "Limited-time packages and seasonal deals across Smart Autocare Garage branches. Book via WhatsApp to confirm availability at your preferred outlet.",
};

export type Promotion = {
  id: string;
  title: string;
  blurb: string;
  validity: string;
  badge?: string;
};

/** Placeholder offers — client to confirm final copy */
export const promotions: Promotion[] = [
  {
    id: "service-package",
    title: "Full Service Package",
    blurb:
      "Oil change, filter check, and multi-point inspection at a bundled rate — ideal for scheduled maintenance.",
    validity: "Valid while stocks / slots last",
    badge: "Popular",
  },
  {
    id: "brake-care",
    title: "Brake Care Special",
    blurb:
      "Brake inspection with preferential labour rates on pads and discs when booked as a package.",
    validity: "Selected branches · ask advisor",
    badge: "Limited",
  },
  {
    id: "ac-refresh",
    title: "A/C System Refresh",
    blurb:
      "Cooling check, filter assessment, and system clean-up to keep cabin air and performance in shape.",
    validity: "Seasonal offer · subject to change",
  },
];

export const promotionsCta = {
  heading: "Ready to claim<br />an offer?",
  cta: "Book on WhatsApp",
  bgImg: "/images/branches/branch-03.jpg",
};
