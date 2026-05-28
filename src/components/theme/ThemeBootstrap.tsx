"use client";

import { useServerInsertedHTML } from "next/navigation";

type ThemeBootstrapProps = {
  script: string;
};

export function ThemeBootstrap({ script }: ThemeBootstrapProps) {
  useServerInsertedHTML(() => (
    <script
      id="theme-init"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  ));

  return null;
}
