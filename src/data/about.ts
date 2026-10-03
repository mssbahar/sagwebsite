/** About page content — edit placeholders below before launch. */

export type AboutStat = {
  label: string;
  value: number | string;
  suffix?: string;
  numeric?: boolean;
};

export type AboutCarGet = {
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
  image: "/images/herosag.jpg",
  imageAlt: "Smart Autocare Garage service bay",
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

/** What the car leaves with — workshop job card, not a company timeline. */
export const aboutCarGets = {
  eyebrow: "What your car gets",
  headlineLead: "Serviced at SAG,",
  headlineRest: "your car leaves with this.",
  items: [
    {
      title: "Clear answers before any repair begins",
      description:
        "We start with a proper diagnostic scan of your vehicle. Your service advisor will explain the issue in simple terms — what part has failed, why it happened, and the expected repair cost — before any work begins. Once you approve, our technicians will proceed with the repair.",
      image: "/images/diagnosis.jpg",
      imageAlt: "Technician running a diagnostic scan at SAG",
    },
    {
      title: "Parts covered for 6–12 months",
      description:
        "Selected parts stay covered after you drive away. Cover runs 6 to 12 months, and it depends on the part fitted: OEM, original, or used. Your advisor tells you which one is going on, and how long it is covered, before you agree.",
      image: "/images/partwarranty.jpg",
      imageAlt: "Parts fitted at SAG and covered after the repair",
    },
    {
      title: "Skilled technicians working on your vehicle",
      description:
        "From routine maintenance to major repairs, our experienced technicians handle every vehicle with care using professional equipment and hydraulic lifts. We service sedans, SUVs, MPVs, and European vehicles. The same advisor who receives your vehicle will follow through and ensure your job is completed properly from start to finish.",
      image: "/images/technician.jpg",
      imageAlt: "SAG technician working on a vehicle",
    },
    {
      title: "Stay informed throughout the repair process",
      description:
        "You will receive regular updates while your vehicle is with us — including repair progress, any changes in cost, and the expected collection time. Whether you are waiting in our lounge or have left the workshop, we keep you informed every step of the way.",
      image: "/images/custrelay.jpg",
      imageAlt: "Service advisor keeping a customer updated at SAG",
    },
  ] satisfies AboutCarGet[],
};

export const aboutFuturePlans: AboutFuturePlan[] = [
  {
    number: "01",
    title: "Nationwide expansion",
    teaser: "Every state in Malaysia",
    description:
      "Expand Smart Autocare Garage across every state — so wherever you are, you can count on warm, reliable service while we stay honest and transparent.",
    image: "/images/sagbuilding.png",
    imageAlt: "SAG workshop branches across Malaysia",
  },
  {
    number: "02",
    title: "Customer relationships",
    teaser: "Care that feels like family",
    description:
      "Keep every visit personal with friendly service and honest advice — so each stop at SAG feels like visiting someone you trust.",
    image: "/images/sagcustomer.png",
    imageAlt: "SAG advisors with customers after a service",
  },
  {
    number: "03",
    title: "Choices & flexibility",
    teaser: "Options for every budget",
    description:
      "Offer a wide range of services, parts, and affordable alternatives — so customers can choose with confidence.",
    image: "/images/carsag.png",
    imageAlt: "Sports cars, MPVs, and SUVs serviced at SAG",
  },
  {
    number: "04",
    title: "Strong partnerships",
    teaser: "Trusted industry allies",
    description:
      "Partner with reputable suppliers and industry leaders to bring innovative, high-quality solutions our customers can rely on.",
    image: "/images/shakehand.jpg",
    imageAlt: "Handshake over an open engine bay",
  },
];

export const aboutCta = {
  heading:
    "A connected service network,<br />giving you peace of mind wherever you are in Malaysia.",
  cta: "Book now!",
  bgImg: "/images/branches/branch-07.jpg",
};
