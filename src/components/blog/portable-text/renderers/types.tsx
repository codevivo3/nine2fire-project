import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { AppLocale } from "@/i18n/routing";
import { EditorialImageBlock } from "../components/EditorialImageBlock";
import { ResourceCard } from "../components/ResourceCard";
import { SuggestedReadings } from "../components/SuggestedReadings";
import {
  type PortableTextChartBlock,
  type PortableTextImageBlock,
  type PortableTextNoteBlock,
  type PortableTextQuoteBlock,
  type PortableTextResourceCard,
  type PortableTextSuggestedReadings,
} from "../types";
import { noteBlocks } from "./blocks";
import { noteMarks } from "./marks";

type PortableTextTypeRenderers = NonNullable<PortableTextComponents["types"]>;

const noteComponents: PortableTextComponents = {
  block: noteBlocks,
  marks: noteMarks,
};

export function createTypeRenderers(
  locale: AppLocale,
): PortableTextTypeRenderers {
  return {
    imageBlock: ({ value }) => (
      <EditorialImageBlock value={value as PortableTextImageBlock} />
    ),
    noteBlock: ({ value }) => {
      const note = value as PortableTextNoteBlock;
      const toneClassName =
        note.tone === "insight"
          ? "border-accent-token/30 bg-accent-token/6"
          : note.tone === "warning"
            ? "border-foreground/20 bg-surface/95"
            : "border-border-token bg-surface/75";

      return (
        <aside
          className={`my-10 rounded-[var(--radius-lg)] border p-5 md:p-6 ${toneClassName}`}
        >
          {note.title ? (
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token">
              {note.title}
            </h3>
          ) : null}

          {note.body ? (
            <PortableText value={note.body} components={noteComponents} />
          ) : null}
        </aside>
      );
    },
    quoteBlock: ({ value }) => {
      const quote = value as PortableTextQuoteBlock;

      return (
        <figure className="my-6 border-l border-accent-token/30 pl-4 md:my-7 md:pl-5">
          {quote.quote ? (
            <blockquote className="text-lg leading-6 tracking-[-0.005em] text-foreground/78 italic">
              {quote.quote}
            </blockquote>
          ) : null}
          {quote.attribution ? (
            <figcaption className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/85">
              {quote.attribution}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    resourceCard: ({ value }) => (
      <div className="my-10">
        <ResourceCard value={value as PortableTextResourceCard} />
      </div>
    ),
    chartPlaceholder: ({ value }) => {
      const chart = value as PortableTextChartBlock;

      return (
        <div className="my-10 rounded-[var(--radius-lg)] border border-dashed border-border-token bg-surface/60 p-5 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token">
            Chart placeholder
          </p>
          {chart.title ? (
            <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
              {chart.title}
            </h3>
          ) : null}
          {chart.description ? (
            <p className="mt-3 text-sm leading-6 text-foreground/75">
              {chart.description}
            </p>
          ) : null}
          {chart.sourceLabel ? (
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {chart.sourceLabel}
            </p>
          ) : null}
        </div>
      );
    },
    suggestedReadings: ({ value }) => (
      <SuggestedReadings
        locale={locale}
        value={value as PortableTextSuggestedReadings}
      />
    ),
  };
}

