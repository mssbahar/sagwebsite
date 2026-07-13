export type Stat = {
  label: string;
  value: number | string;
  suffix?: string;
  numeric?: boolean;
};

/** TBD — client to confirm actual figures */
export const stats: Stat[] = [
  { label: "Branches Nationwide", value: 10, suffix: "+", numeric: true },
  { label: "Satisfied Customers", value: 5000, suffix: "+", numeric: true },
  { label: "Service Bays", value: 8, numeric: true },
  { label: "Service Categories", value: 6, numeric: true },
  { label: "Certified Technicians", value: 3, suffix: "+", numeric: true },
  { label: "Parts Warranty", value: "12mo", numeric: false },
];
