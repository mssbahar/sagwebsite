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
  image: string;
  imageAlt: string;
};

export type AboutFuturePlan = {
  number: string;
  title: string;
  teaser: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const aboutHero = {
  eyebrow: "Our Mission",
  headline: "Caring for your car, the smart way.",
  intro:
    "We're reshaping auto repair in Malaysia — quality service in a space that feels like home. We grow nationwide and partner with trusted industry allies so professionalism and customer care become the new standard.",
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
  headline: "Trusted care, in every state.",
  lead: "To be Malaysia's go-to for all automotive needs — with a presence nationwide.",
  body: "Wherever you are, you can rely on SAG for peace of mind and service you trust.",
};

/** Branch openings from SAG Company Profile 2026 V1 (Milestones). */
export const aboutTimeline: AboutTimelineItem[] = [
  {
    year: "2017",
    title: "HQ opens in Selangor",
    description:
      "Smart Autocare Garage opens its headquarters in Subang Jaya — the start of our nationwide network.",
    image: "/images/branches/branch-01.jpg",
    imageAlt: "Smart Autocare Garage Subang Jaya HQ",
  },
  {
    year: "2020",
    title: "1st Johor branch",
    description:
      "We expand south with our first Johor outlet in Mount Austin, Johor Bahru.",
    image: "/images/branches/branch-05.jpg",
    imageAlt: "Smart Autocare Garage Mount Austin",
  },
  {
    year: "2021",
    title: "1st Kuala Lumpur branch",
    description:
      "SAG arrives in the capital with our Chan Sow Lin workshop.",
    image: "/images/branches/branch-04.jpg",
    imageAlt: "Smart Autocare Garage Chan Sow Lin",
  },
  {
    year: "2023",
    title: "2nd Selangor branch",
    description:
      "Bukit Raja in Klang opens, growing our presence across Selangor.",
    image: "/images/branches/branch-02.jpg",
    imageAlt: "Smart Autocare Garage Bukit Raja",
  },
  {
    year: "2024",
    title: "1st Kelantan branch",
    description:
      "We open in Kota Bharu, bringing SAG service to the East Coast.",
    image: "/images/branches/branch-08.jpg",
    imageAlt: "Smart Autocare Garage Kota Bharu",
  },
  {
    year: "2024",
    title: "1st Penang branch",
    description:
      "Bukit Mertajam opens — our first workshop in Pulau Pinang.",
    image: "/images/branches/branch-09.jpg",
    imageAlt: "Smart Autocare Garage Bukit Mertajam",
  },
  {
    year: "2024",
    title: "2nd Johor branch",
    description:
      "Segamat joins the network, strengthening coverage across Johor.",
    image: "/images/branches/branch-07.jpg",
    imageAlt: "Smart Autocare Garage Segamat",
  },
  {
    year: "2024",
    title: "1st Sarawak branch",
    description:
      "Kuching opens — SAG's first East Malaysia workshop.",
    image: "/images/branches/branch-10.jpg",
    imageAlt: "Smart Autocare Garage Kuching",
  },
  {
    year: "2024",
    title: "4th Selangor branch",
    description:
      "Balakong opens, adding another Selangor location for customers nearby.",
    image: "/images/branches/branch-03.jpg",
    imageAlt: "Smart Autocare Garage Balakong",
  },
  {
    year: "2025",
    title: "3rd Johor branch",
    description:
      "Skudai opens, expanding our Johor footprint further.",
    image: "/images/branches/branch-06.jpg",
    imageAlt: "Smart Autocare Garage Skudai",
  },
  {
    year: "2025",
    title: "3rd Selangor branch",
    description:
      "Kajang opens, bringing SAG closer to more Selangor drivers.",
    image: "/images/branches/branch-03.jpg",
    imageAlt: "Smart Autocare Garage Kajang",
  },
  {
    year: "2026",
    title: "2nd Penang branch",
    description:
      "Air Itam (Georgetown) opens — our second Penang workshop.",
    image: "/images/branches/branch-09.jpg",
    imageAlt: "Smart Autocare Garage Air Itam",
  },
  {
    year: "2028",
    title: "Nationwide coverage",
    description:
      "By 2028, we aim to cover all of Malaysia — so wherever you drive, SAG is nearby.",
    image: "/images/herovisual.png",
    imageAlt: "Smart Autocare Garage nationwide network vision",
  },
];

export const aboutFuturePlans: AboutFuturePlan[] = [
  {
    number: "01",
    title: "Nationwide expansion",
    teaser: "Every state in Malaysia",
    description:
      "Expand Smart Autocare Garage across every state — so wherever you are, you can count on warm, reliable service while we stay honest and transparent.",
    image: "/images/herovisual.png",
    imageAlt: "SAG workshops expanding across Malaysia",
  },
  {
    number: "02",
    title: "Customer relationships",
    teaser: "Care that feels like family",
    description:
      "Keep every visit personal with friendly service and honest advice — so each stop at SAG feels like visiting someone you trust.",
    image: "/images/branches/branch-05.jpg",
    imageAlt: "Welcoming customer experience at SAG",
  },
  {
    number: "03",
    title: "Choices & flexibility",
    teaser: "Options for every budget",
    description:
      "Offer a wide range of services, parts, and affordable alternatives — so customers can choose with confidence.",
    image: "/images/branches/branch-06.jpg",
    imageAlt: "Flexible service and parts options at SAG",
  },
  {
    number: "04",
    title: "Strong partnerships",
    teaser: "Trusted industry allies",
    description:
      "Partner with reputable suppliers and industry leaders to bring innovative, high-quality solutions our customers can rely on.",
    image: "/images/branches/branch-04.jpg",
    imageAlt: "SAG industry partnerships and quality parts",
  },
];

export const aboutCta = {
  heading:
    "A connected service network,<br />giving you peace of mind wherever you are in Malaysia.",
  cta: "Book now!",
  bgImg: "/images/branches/branch-07.jpg",
};
