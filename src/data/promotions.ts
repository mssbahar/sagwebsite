const posterFiles = [
  "Oil Booster Package.jpg",
  "AC Flushing.jpg",
  "Brake Service.jpg",
  "Cabin Filter.jpg",
  "Octane Booster.jpg",
  "Wiper set.jpg",
  "Balance Shaft Promo.jpg",
  "Tensioner, Water Pump, Belting.jpg",
  "Neck Rest.jpg",
  "Seat Table Board.jpg",
];

export const promotionsHero = {
  eyebrow: "Current offers",
  headline: "Promotions",
};

export const promotions = posterFiles.map((file) => ({
  src: `/images/promotion/${encodeURI(file)}`,
  alt: file.replace(/\.jpg$/i, ""),
}));

export const promotionsCta = {
  heading: "Ready to claim<br />an offer?",
  cta: "Book on WhatsApp",
  bgImg: "/images/branches/branch-03.jpg",
};
