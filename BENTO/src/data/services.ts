export type Service = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
};

export const servicesHero = {
  eyebrow: "One-stop automotive solution",
  headline: "Our Services",
  intro:
    "We provide complete vehicle inspection, repair, and expert consultation — ensuring your car stays safe and in top condition. Sedans, SUVs, MPVs and luxury cars from Asian and European brands.",
  image: "/images/branches/branch-05.jpg",
  imageAlt: "Smart Autocare Garage service bay",
};

export const services: Service[] = [
  {
    id: "general-maintenance",
    title: "General Maintenance",
    tagline: "Essential care for smooth, reliable performance.",
    description: "Essential maintenance for smooth, reliable performance.",
    longDescription:
      "Regular maintenance services to keep your vehicle running smoothly, including oil changes, fluid checks, tire rotations, and more, ensuring your car performs at its best.",
    icon: "Wrench",
    image: "/images/branches/branch-02.jpg",
  },
  {
    id: "major-minor-repairs",
    title: "Major & Minor Repairs",
    tagline: "Expert solutions for every repair.",
    description: "Expert solutions for every repair, handled by skilled professionals.",
    longDescription:
      "From routine repairs to complex mechanical issues, we offer expert solutions for all types of vehicle problems. Whether it's a minor fix or a major overhaul, our skilled technicians are equipped to handle it.",
    icon: "Hammer",
    image: "/images/branches/branch-03.jpg",
  },
  {
    id: "inspection",
    title: "Comprehensive Inspection",
    tagline: "Detect early. Prevent costly repairs.",
    description: "We inspect, detect early issues, and prevent costly repairs.",
    longDescription:
      "We perform detailed inspections and vehicle checkups to identify and address any potential issues, preventing costly repairs down the line. Our thorough diagnostics help ensure the long-term health of your car.",
    icon: "Search",
    image: "/images/branches/branch-06.jpg",
  },
  {
    id: "warranty",
    title: "6–12 Month Parts Warranty",
    tagline: "Peace of mind on selected components.",
    description: "Selected parts are backed by a 6–12 month warranty.",
    longDescription:
      "For certain components, we offer a 6–12 month parts warranty, depending on the type used (OEM, original, or used) — your peace of mind, guaranteed.",
    icon: "Shield",
    image: "/images/branches/branch-08.jpg",
  },
];

export const serviceProcess = [
  {
    step: "01",
    title: "Book",
    description: "Message us on WhatsApp with your car details and preferred time — we'll confirm your slot.",
    icon: "MessageCircle",
  },
  {
    step: "02",
    title: "Drop off",
    description: "Bring your vehicle to the branch nearest you. Our team will log it in and listen to your concerns.",
    icon: "Car",
  },
  {
    step: "03",
    title: "We fix",
    description: "Inspection, diagnosis, and repair by skilled technicians — with updates so you're never left guessing.",
    icon: "Wrench",
  },
  {
    step: "04",
    title: "Collect",
    description: "Pick up your car knowing the job is done right — backed by our parts warranty where applicable.",
    icon: "CircleCheck",
  },
];

export const servicesCta = {
  heading: "Book your next service<br />with SAG.",
  bgImg: "/images/branches/branch-01.jpg",
};
