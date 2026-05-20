/**
 * FILE: src/lib/blog/formatPostDate.ts
 *
 * PURPOSE:
 * - Formats blog publication dates for UI rendering
 * - Keeps date presentation independent from the temporary local data source
 *
 * NOTES:
 * - This helper should remain valid when posts move to Sanity
 * - It accepts ISO-like date strings from the shared `Post` model
 */
export function formatPostDate(
  date: string | null | undefined,
  locale: string,
) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}
