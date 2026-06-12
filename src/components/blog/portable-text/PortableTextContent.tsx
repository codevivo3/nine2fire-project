import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { blocks } from "./renderers/blocks";
import { listItems, lists } from "./renderers/lists";
import { marks } from "./renderers/marks";
import { createTypeRenderers } from "./renderers/types";
import type { PortableTextContentProps } from "./types";

function createComponents(locale: PortableTextContentProps["locale"]): PortableTextComponents {
  return {
    block: blocks,
    marks,
    list: lists,
    listItem: listItems,
    types: createTypeRenderers(locale),
  };
}

export function PortableTextContent({
  value,
  locale,
}: PortableTextContentProps) {
  return <PortableText value={value} components={createComponents(locale)} />;
}

