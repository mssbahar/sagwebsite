export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: "tiktok" | "instagram" | "facebook";
};

export const socialLinks: SocialLink[] = [
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@smartautocaregaragehq",
    icon: "tiktok",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/smartautocaregarage",
    icon: "instagram",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1ExJXbyQe7/",
    icon: "facebook",
  },
];
