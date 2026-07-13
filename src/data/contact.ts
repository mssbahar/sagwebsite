import { site } from "./site";
import { featuredBranch } from "./branches";

export const contactHero = {
  eyebrow: "Get in touch",
  headline: "Contact Us",
  intro:
    "Questions, bookings or quotes — reach our headquarters or pick a branch near you. We're ready to help you get back on the road.",
};

export const hqContact = {
  id: "hq",
  label: "Headquarters",
  name: `${site.shortName} HQ — ${featuredBranch.name}`,
  address: site.hqAddress,
  hours: site.hours,
  phone: site.phone,
  email: site.email,
  mapsUrl: featuredBranch.mapsUrl,
  whatsappUrl: site.whatsappUrl,
};
