import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import {
  openEnglishPreviewAction,
  openItalianPreviewAction,
} from "./src/sanity/documentActions/postPreviewActions";
import {
  sanityDataset,
  sanityProjectId,
  sanityStudioTitle,
} from "./src/lib/sanity/env";

export default defineConfig({
  name: "default",
  title: sanityStudioTitle,
  basePath: "/studio",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  plugins: [structureTool(), visionTool()],
  document: {
    actions: (previousActions, context) =>
      context.schemaType === "post"
        ? [
            ...previousActions,
            openEnglishPreviewAction,
            openItalianPreviewAction,
          ]
        : previousActions,
  },
  schema: {
    types: schemaTypes,
  },
});
