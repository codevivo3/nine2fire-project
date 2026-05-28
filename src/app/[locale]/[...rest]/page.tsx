import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { AppLocale } from "@/i18n/routing";

type LocaleCatchAllPageProps = {
  params: Promise<{
    locale: AppLocale;
    rest: string[];
  }>;
};

export default async function LocaleCatchAllPage({
  params,
}: LocaleCatchAllPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);
  notFound();
}
