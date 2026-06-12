import type { PortableTextComponents } from "@portabletext/react";

type PortableTextListRenderers = NonNullable<PortableTextComponents["list"]>;
type PortableTextListItemRenderers = NonNullable<
  PortableTextComponents["listItem"]
>;

export const lists: PortableTextListRenderers = {
  bullet: ({ children }) => (
    <ul className="my-6 list-disc space-y-2 pl-6 text-[15px] leading-7 text-foreground/90 marker:text-accent-token">
      {children}
    </ul>
  ),
  number: ({ children }) => (
    <ol className="my-6 list-decimal space-y-2 pl-6 text-[15px] leading-7 text-foreground/90 marker:font-semibold marker:text-accent-token">
      {children}
    </ol>
  ),
};

export const listItems: PortableTextListItemRenderers = {
  bullet: ({ children }) => <li className="pl-1">{children}</li>,
  number: ({ children }) => <li className="pl-1">{children}</li>,
};

