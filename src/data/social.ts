export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: "tiktok" | "instagram" | "facebook";
};

/** Placeholder URLs — client to confirm */
export const socialLinks: SocialLink[] = [
  { id: "tiktok", label: "TikTok", href: "#", icon: "tiktok" },
  { id: "instagram", label: "Instagram", href: "#", icon: "instagram" },
  { id: "facebook", label: "Facebook", href: "#", icon: "facebook" },
];
