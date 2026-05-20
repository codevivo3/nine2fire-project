/**
 * PURPOSE:
 * Loads Google Analytics on demand after the user grants consent.
 *
 * NOTES:
 * - Analytics is intentionally not part of the server-rendered document tree.
 * - The loader is idempotent so consent-driven re-entry or route transitions do
 *   not inject duplicate GA scripts.
 */
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const GA_ID = 'G-29Z02MXK9N';

export function loadGoogleAnalytics() {
  if (typeof window === 'undefined') return;

  if (document.getElementById('ga-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  gtag('js', new Date());
  gtag('config', GA_ID, {
    page_path: window.location.pathname,
  });
}

export {};
