import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import {
  openEnglishPreviewAction,
  openItalianPreviewAction,
} from "./src/sanity/documentActions/postPreviewActions";
import {
  sanityStudioApiVersion,
  sanityStudioDataset,
  sanityStudioProjectId,
  sanityStudioTitle,
} from "./src/lib/sanity/studioEnv";

export default defineConfig({
  name: "default",
  title: sanityStudioTitle,
  basePath: "/studio",
  projectId: sanityStudioProjectId,
  dataset: sanityStudioDataset,
  apiVersion: sanityStudioApiVersion,
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
