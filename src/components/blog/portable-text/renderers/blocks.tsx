import type { PortableTextComponents } from "@portabletext/react";

type PortableTextBlockRenderers = NonNullable<PortableTextComponents["block"]>;

export const noteBlocks: PortableTextBlockRenderers = {
  normal: ({ children }) => (
    <p className="text-sm leading-7 text-foreground/85">{children}</p>
  ),
};

export const blocks: PortableTextBlockRenderers = {
  normal: ({ children }) => (
    <p className='text-[15px] leading-7 text-foreground/90'>{children}</p>
  ),
  h2: ({ children }) => (
    <h2 className='pt-6 text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl'>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className='pt-5 text-xl font-semibold tracking-[-0.025em] text-foreground md:text-2xl'>
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className='pt-4 text-lg font-semibold tracking-[-0.02em] text-foreground md:text-xl'>
      {children}
    </h4>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className='my-6 border-l-4 pl-5 italic text-foreground/80 md:my-8 md:pl-6'
      style={{ borderLeftColor: 'var(--color-accent)' }}
    >
      {children}
    </blockquote>
  ),
};
