export type Branch = {
  id: string;
  name: string;
  region: string;
  address: string;
  hours: string;
  phone: string;
  mapsUrl: string;
  image: string;
  featured?: boolean;
  /** Approximate WGS84 coordinates for nearest-branch */
  lat: number;
  lng: number;
  map?: { x: number; y: number };
};

export const branches: Branch[] = [
  {
    id: "subang-jaya",
    name: "Subang Jaya",
    region: "SGR",
    address: "No.5, Lorong SS13/3B, Subang Jaya Industrial Estate, 47500 Subang Jaya.",
    hours: "Mon – Sat 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Subang+Jaya",
    image: "/images/branches/branch-01.jpg",
    featured: true,
    lat: 3.0704,
    lng: 101.5979,
    map: { x: 48, y: 58 },
  },
  {
    id: "bukit-raja",
    name: "Bukit Raja",
    region: "SGR",
    address: "No.26, Jalan Astaka 4B/KU2, Bandar Bukit Raja, 41050 Klang, Selangor.",
    hours: "Mon – Sat 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Bukit+Raja",
    image: "/images/branches/branch-02.jpg",
    lat: 3.0896,
    lng: 101.4503,
    map: { x: 45, y: 60 },
  },
  {
    id: "kajang",
    name: "Kajang",
    region: "SGR",
    address: "Lot 1357, Batu 15 1/2, Jalan Semenyih, 43000 Kajang, Selangor.",
    hours: "Mon – Sat 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Kajang",
    image: "/images/branches/branch-03.jpg",
    lat: 2.9651,
    lng: 101.8353,
    map: { x: 50, y: 61 },
  },
  {
    id: "chan-sow-lin",
    name: "Chan Sow Lin",
    region: "KL",
    address: "No.46, Jalan Chan Sow Lin, 55200 Kuala Lumpur.",
    hours: "Mon – Sat 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Chan+Sow+Lin",
    image: "/images/branches/branch-04.jpg",
    lat: 3.1276,
    lng: 101.7158,
    map: { x: 52, y: 62 },
  },
  {
    id: "mount-austin",
    name: "Mount Austin",
    region: "JHR",
    address: "No.21, Jalan Mutiara Emas 5/2, Taman Mount Austin, 81100 Johor Bahru, Johor.",
    hours: "Mon – Sat 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Mount+Austin",
    image: "/images/branches/branch-05.jpg",
    lat: 1.5488,
    lng: 103.7768,
    map: { x: 54, y: 78 },
  },
  {
    id: "skudai",
    name: "Skudai",
    region: "JHR",
    address: "No.15, Jalan Persiaran Skudai 8, Pusat Perusahaan Skudai 8, 81300 Skudai, Johor.",
    hours: "Mon – Sat 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Skudai",
    image: "/images/branches/branch-06.jpg",
    lat: 1.5269,
    lng: 103.6401,
    map: { x: 53, y: 80 },
  },
  {
    id: "segamat",
    name: "Segamat",
    region: "JHR",
    address: "Lot 14, Jalan Kejuruteraan 5, Jalan Genuang, Kawasan Perindustrian, 85000 Segamat, Johor.",
    hours: "Mon – Sat 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Segamat",
    image: "/images/branches/branch-07.jpg",
    lat: 2.4923,
    lng: 102.8633,
    map: { x: 51, y: 70 },
  },
  {
    id: "kota-bharu",
    name: "Kota Bharu",
    region: "KTN",
    address: "Lot 101, Jalan Dusun Muda, 15200 Kota Bharu, Kelantan.",
    hours: "Sat – Thu 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Kota+Bharu",
    image: "/images/branches/branch-08.jpg",
    lat: 6.1211,
    lng: 102.2472,
    map: { x: 58, y: 42 },
  },
  {
    id: "bukit-mertajam",
    name: "Bukit Mertajam",
    region: "PNG",
    address: "No.11A, Lorong Asas Jaya 11, Kawasan Industri Ringan Asas Jaya, 14000 Bukit Mertajam, Pulau Pinang.",
    hours: "Mon – Sat 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Bukit+Mertajam",
    image: "/images/branches/branch-09.jpg",
    lat: 5.3643,
    lng: 100.4610,
    map: { x: 42, y: 52 },
  },
  {
    id: "kuching",
    name: "Kuching",
    region: "SRWK",
    address: "Lot 2033, Bintawa Industrial Estate, Jalan Semangat, 93450 Kuching, Sarawak.",
    hours: "Mon – Sat 8:30AM – 5:00PM",
    phone: "010-212 3939",
    mapsUrl: "https://maps.google.com/?q=Smart+Autocare+Garage+Kuching",
    image: "/images/branches/branch-10.jpg",
    lat: 1.5719,
    lng: 110.3976,
    map: { x: 82, y: 76 },
  },
  {
    id: "branch-11",
    name: "Branch 11",
    region: "TBD",
    address: "Address pending — client to confirm 11th branch details.",
    hours: "Mon – Sat 9:30AM – 6:00PM",
    phone: "010-212 3939",
    mapsUrl: "#",
    image: "/images/branches/branch-10.jpg",
    lat: 0,
    lng: 0,
  },
];

export const featuredBranch = branches.find((b) => b.featured) ?? branches[0];

export const mapBranches = branches.filter((b) => b.map);

export function branchPayload(b: Branch) {
  return JSON.stringify({
    id: b.id,
    name: b.name,
    region: b.region,
    address: b.address,
    hours: b.hours,
    phone: b.phone,
    mapsUrl: b.mapsUrl,
    image: b.image,
    lat: b.lat,
    lng: b.lng,
  });
}

/** Haversine distance in km */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function findNearestBranch(
  list: Pick<Branch, "id" | "lat" | "lng">[],
  user: { lat: number; lng: number },
) {
  let best: { id: string; km: number } | null = null;
  for (const b of list) {
    if (!b.lat && !b.lng) continue;
    const km = distanceKm(user, b);
    if (!best || km < best.km) best = { id: b.id, km };
  }
  return best;
}
