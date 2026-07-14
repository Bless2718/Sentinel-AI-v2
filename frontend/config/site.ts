export const siteConfig = {
  name: "Sentinel AI",
  description:
    "Transform Crime Data into Actionable Intelligence.",
  url: "http://localhost:3000",

  navigation: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Features",
      href: "#features",
    },
    {
      title: "Documentation",
      href: "#",
    },
    {
      title: "About",
      href: "#",
    },
  ],
};

export type SiteConfig = typeof siteConfig;