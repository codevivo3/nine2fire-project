/**
 * PURPOSE:
 * Marks long-form article routes as reading surfaces.
 *
 * NOTES:
 * - This keeps article-specific atmosphere tuning attached to the route tree
 *   instead of coupling it to pathname checks or article components.
 * - The wrapper uses `display: contents` semantics via Tailwind so it does not
 *   change the rendered article layout while still exposing stable DOM state
 *   for global CSS.
 */
export default function BlogArticleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-page-surface="article"
      className="contents"
    >
      {children}
    </div>
  );
}

