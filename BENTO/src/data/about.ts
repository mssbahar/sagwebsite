/** About page content — edit placeholders below before launch. */

export type AboutStat = {
  label: string;
  value: number | string;
  suffix?: string;
  numeric?: boolean;
};

export type AboutTimelineItem = {
  year: string;
  month?: string;
  day?: string;
  title: string;
  description: string;
};

export type AboutFuturePlan = {
  number: string;
  title: string;
  description: string;
};

export const aboutHero = {
  eyebrow: "About Us",
  headline: "Caring for your car, the smart way.",
  intro:
    "Smart Autocare Garage aims to transform Malaysia's auto repair industry by becoming the trusted, go-to destination for all automotive needs. We provide professional, high-quality service in a friendly, welcoming environment, while expanding nationwide and partnering with reputable industry leaders to elevate standards and customer satisfaction.",
  /** Replace with final hero image path */
  image: "/images/branches/branch-02.jpg",
  imageAlt: "[Placeholder: workshop or HQ hero image]",
};

export const aboutPerformance = {
  eyebrow: "Proven Performance Record",
  tagline:
    "Not just promises, but real results backed by experience and customer trust.",
  stats: [
    { label: "Established", value: 2017, numeric: true },
    { label: "Years of Experience", value: 20, numeric: true },
    { label: "Job Done", value: 162857, suffix: "+", numeric: true },
    { label: "Employees", value: 200, suffix: "+", numeric: true },
  ] satisfies AboutStat[],
};

export const aboutVision = {
  eyebrow: "Our Vision",
  headline: "[Placeholder: vision headline]",
  lead: "[Placeholder: one-line vision statement — shown in accent pink.]",
  body: "[Placeholder: supporting vision copy — 1–2 sentences on where SAG is headed.]",
};

/** Replace each item with real milestones (year, title, description). */
export const aboutTimeline: AboutTimelineItem[] = [
  {
    year: "2017",
    month: "Jan",
    day: "01",
    title: "[Placeholder: milestone title]",
    description: "[Placeholder: what happened this year.]",
  },
  {
    year: "[YYYY]",
    title: "[Placeholder: milestone title]",
    description: "[Placeholder: what happened this year.]",
  },
  {
    year: "[YYYY]",
    title: "[Placeholder: milestone title]",
    description: "[Placeholder: what happened this year.]",
  },
  {
    year: "[YYYY]",
    title: "[Placeholder: milestone title]",
    description: "[Placeholder: what happened this year.]",
  },
];

export const aboutFuturePlans: AboutFuturePlan[] = [
  {
    number: "01",
    title: "Nationwide expansion",
    description:
      "Smart Autocare Garage aims to transform the auto repair industry in Malaysia by becoming the trusted destination for all automotive needs.",
  },
  {
    number: "02",
    title: "Strengthening Customer Relationships",
    description:
      "We are committed to building lasting relationships by providing honest, friendly, and trustworthy service to a trusted family member.",
  },
  {
    number: "03",
    title: "Offering More Choices and Flexibility",
    description:
      "We offer flexible service options and affordable choices to suit different needs and budgets, empowering customers to make informed decisions with confidence.",
  },
  {
    number: "04",
    title: "Building strong partnerships",
    description:
      "We partner with reputable suppliers and industry leaders to bring innovative, trusted, and high-quality solutions.",
  },
];

export const aboutCta = {
  heading:
    "A connected service network,<br />giving you peace of mind wherever you are in Malaysia.",
  cta: "Book now!",
  bgImg: "/images/branches/branch-07.jpg",
};
