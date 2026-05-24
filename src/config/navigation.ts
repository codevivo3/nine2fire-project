import { routes } from "@/config/routes";

export type NavItem = {
  href: string;
  labelKey: string;
};

export const mainNavLinks: NavItem[] = [
  { href: routes.sections.approach, labelKey: 'links.approach' },
  { href: routes.sections.roadmap, labelKey: 'links.roadmap' },
  { href: routes.sections.insights, labelKey: 'links.insights' },
  { href: routes.blog, labelKey: 'links.journal' },
];
