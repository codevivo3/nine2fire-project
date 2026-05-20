export const dynamic = "force-static";
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

import { StudioPageClient } from "./studio-page-client";

export default function StudioPage() {
  return <StudioPageClient />;
}
