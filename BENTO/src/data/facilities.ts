export type Facility = {
  id: string;
  no: string;
  title: string;
  tagline: string;
  desc: string;
  longDescription: string;
  icon: string;
  image: string;
};

export const workshopHero = {
  eyebrow: "Facilities",
  headline: "Workshop Facilities",
  intro:
    "Precision equipment and a professional environment engineered to deliver the highest standard of automotive care — at every SAG branch nationwide.",
  image: "/images/branches/branch-05.jpg",
  imageAlt: "Smart Autocare Garage workshop bay",
};

export const facilities: Facility[] = [
  {
    id: "service-lifts",
    no: "01",
    title: "Hydraulic Service Lifts",
    tagline: "Full undercarriage access for every job.",
    desc: "Professional-grade two-post and four-post lifts at every branch.",
    longDescription:
      "Professional-grade two-post and four-post lifts give full undercarriage access for comprehensive servicing and inspection at every branch — from oil changes to major repairs.",
    icon: "ArrowUpFromLine",
    image: "/images/branches/branch-03.jpg",
  },
  {
    id: "diagnostics",
    no: "02",
    title: "Advanced Diagnostics",
    tagline: "Pinpoint faults across all makes and models.",
    desc: "OBD scanners and computerised diagnostic tools.",
    longDescription:
      "OBD scanners and computerised diagnostic tools compatible with all makes and models, delivering accurate, fast fault identification before any repair begins.",
    icon: "Cpu",
    image: "/images/branches/branch-06.jpg",
  },
  {
    id: "alignment",
    no: "03",
    title: "Wheel Alignment System",
    tagline: "Calibrated to manufacturer specifications.",
    desc: "4-wheel alignment for optimal tyre wear and handling.",
    longDescription:
      "4-wheel alignment ensures optimal tyre wear, improved fuel efficiency and superior handling — calibrated to manufacturer specifications by trained technicians.",
    icon: "CircleDot",
    image: "/images/branches/branch-08.jpg",
  },
  {
    id: "customer-lounge",
    no: "04",
    title: "Customer Lounge",
    tagline: "Comfortable waiting while we work.",
    desc: "Wi-Fi, refreshments and live service updates.",
    longDescription:
      "A clean, comfortable waiting area with Wi-Fi, refreshments and live service updates so you can relax while our technicians work on your vehicle.",
    icon: "Sofa",
    image: "/images/branches/branch-04.jpg",
  },
];

export const workshopCta = {
  heading: "Experience our facilities<br />firsthand.",
  cta: "Book a Visit",
  bgImg: "/images/branches/branch-05.jpg",
};
