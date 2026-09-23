/**
 * Trust messaging for elders + boss customers:
 * plain language, car benefits first — not brand poetry.
 */

export const landingCopy = {
  brand: "Smart Autocare",
  kicker: "Garage",
  eyebrow: "Smart Autocare Garage",
  headlineLine1: "Where expertise",
  headlineLine2: "meets your vehicle",
  headline: "Where expertise meets your vehicle",
  sub: "Professional care, on-demand service and trusted automotive solutions. SAG puts your vehicle in expert hands.",
  bookLabel: "Book a service on WhatsApp",
  skip: "Skip",
  soundOn: "Tap for sound",
};

/** What the car / owner gets — not company vanity metrics */
export const carBenefits = [
  {
    title: "Proper check before we work",
    detail: "We inspect first, explain the issue, then repair — no guessing on your car.",
  },
  {
    title: "Parts with warranty",
    detail: "Selected parts carry 6–12 months warranty, so you are covered after the job.",
  },
  {
    title: "Updates you can trust",
    detail: "Advisors keep you informed — progress, cost, and when to collect.",
  },
] as const;

/** Compact chips reserved if needed elsewhere */
export const trustProof = [
  { label: "Checked first", value: "Inspect" },
  { label: "Parts cover", value: "6–12 mo" },
  { label: "Near you", value: "10+" },
] as const;

export const dashboardHero = {
  titleLine1: "What your car",
  titleAccent: "gets",
  titleLine2: "at SAG",
  body: "Safer servicing. Clear advice. Warranty-backed parts where it matters.",
};

export const dashboardQuote = {
  text: "They explained everything clearly and kept me updated. Fair price — I trust them with my car.",
  name: "Eunice Liu",
  source: "Google Review",
};
