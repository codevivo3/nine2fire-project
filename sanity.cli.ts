import { defineCliConfig } from "sanity/cli";
import {
  sanityStudioDataset,
  sanityStudioProjectId,
} from "./src/lib/sanity/studioEnv";

export default defineCliConfig({
  api: {
    projectId: sanityStudioProjectId,
    dataset: sanityStudioDataset,
  },
});
