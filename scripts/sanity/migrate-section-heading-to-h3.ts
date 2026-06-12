import { createClient } from "@sanity/client";

type SanityDocument = {
  _id: string;
  _type?: string;
  [key: string]: unknown;
};

type LegacyOccurrence = {
  path: string;
  count: number;
};

type NormalizeResult = {
  next: unknown;
  count: number;
  occurrences: LegacyOccurrence[];
};

type DocumentMigration = {
  id: string;
  type?: string;
  title: string;
  count: number;
  occurrences: LegacyOccurrence[];
  nextDocument: SanityDocument;
};

const LEGACY_SECTION_HEADING_STYLE = "section" + "Heading";
const SYSTEM_FIELDS = new Set(["_id", "_type", "_rev", "_createdAt", "_updatedAt"]);

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const apiVersion = process.env.SANITY_STUDIO_API_VERSION;
const hasWriteToken = Boolean(process.env.SANITY_API_WRITE_TOKEN);
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
const shouldWrite = process.argv.includes("--write");

if (!projectId || !dataset || !apiVersion || !token) {
  throw new Error(
    "Missing Sanity env vars. Expected SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, SANITY_STUDIO_API_VERSION, and a token.",
  );
}

if (shouldWrite && !hasWriteToken) {
  throw new Error(
    "Refusing to write without SANITY_API_WRITE_TOKEN. Dry run is safe by default; add a write-capable token and re-run with --write.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "raw",
});

function formatPathSegment(segment: string | number) {
  return typeof segment === "number" ? `[${segment}]` : segment;
}

function joinPath(basePath: string, segment: string | number) {
  if (!basePath) {
    return formatPathSegment(segment);
  }

  return typeof segment === "number"
    ? `${basePath}${formatPathSegment(segment)}`
    : `${basePath}.${segment}`;
}

function normalizePortableTextNode(value: unknown, path = ""): NormalizeResult {
  if (Array.isArray(value)) {
    let count = 0;
    const occurrences: LegacyOccurrence[] = [];
    const next = value.map((item, index) => {
      const result = normalizePortableTextNode(item, joinPath(path, index));
      count += result.count;
      occurrences.push(...result.occurrences);
      return result.next;
    });

    return { next, count, occurrences };
  }

  if (!value || typeof value !== "object") {
    return { next: value, count: 0, occurrences: [] };
  }

  const record = value as Record<string, unknown>;
  let count = 0;
  const occurrences: LegacyOccurrence[] = [];
  const next = Object.fromEntries(
    Object.entries(record).map(([key, entryValue]) => {
      const result = normalizePortableTextNode(entryValue, joinPath(path, key));
      count += result.count;
      occurrences.push(...result.occurrences);
      return [key, result.next];
    }),
  ) as Record<string, unknown>;

  if (next._type === "block" && next.style === LEGACY_SECTION_HEADING_STYLE) {
    next.style = "h3";
    count += 1;
    occurrences.push({
      path: path || "<root>",
      count: 1,
    });
  }

  return { next, count, occurrences };
}

function groupOccurrencesByField(occurrences: LegacyOccurrence[]) {
  const grouped = new Map<string, number>();

  for (const occurrence of occurrences) {
    grouped.set(occurrence.path, (grouped.get(occurrence.path) || 0) + occurrence.count);
  }

  return Array.from(grouped.entries()).map(([path, count]) => ({ path, count }));
}

function getDocumentTitle(document: SanityDocument) {
  const title = document.title;

  if (typeof title === "string" && title.trim()) {
    return title;
  }

  if (title && typeof title === "object") {
    const localized = title as Record<string, unknown>;

    for (const key of ["en", "it"]) {
      const value = localized[key];

      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }
  }

  return document._id;
}

function buildDocumentMigration(document: SanityDocument): DocumentMigration | null {
  const result = normalizePortableTextNode(document);

  if (result.count === 0) {
    return null;
  }

  return {
    id: document._id,
    type: document._type,
    title: getDocumentTitle(document),
    count: result.count,
    occurrences: groupOccurrencesByField(result.occurrences),
    nextDocument: result.next as SanityDocument,
  };
}

function getPatchPayload(document: SanityDocument) {
  return Object.fromEntries(
    Object.entries(document).filter(([key]) => !SYSTEM_FIELDS.has(key)),
  );
}

async function fetchCandidateDocuments() {
  return client.fetch<SanityDocument[]>(
    `*[
      !(_type in ["sanity.imageAsset", "sanity.fileAsset"])
    ]`,
  );
}

async function main() {
  console.log(
    shouldWrite
      ? "Write mode enabled. Legacy heading styles will be replaced with h3."
      : "Dry run only. No content will be mutated unless you re-run with --write.",
  );

  const documents = await fetchCandidateDocuments();
  const migrations = documents
    .map(buildDocumentMigration)
    .filter((migration): migration is DocumentMigration => migration !== null);

  if (migrations.length === 0) {
    console.log("No Sanity documents contain the legacy custom heading style.");
    return;
  }

  const totalLegacyBlocks = migrations.reduce((sum, migration) => sum + migration.count, 0);

  console.log(
    `Found ${totalLegacyBlocks} legacy block(s) across ${migrations.length} document(s).`,
  );

  for (const migration of migrations) {
    console.log(`- ${migration.title} (${migration.id}) [${migration.type || "unknown"}]`);

    for (const occurrence of migration.occurrences) {
      console.log(`  ${occurrence.path} -> ${occurrence.count}`);
    }
  }

  if (!shouldWrite) {
    console.log("Re-run with --write and a write-capable SANITY_API_WRITE_TOKEN to update the dataset.");
    console.log("Open the affected draft in Sanity only after the migration succeeds, or update the legacy blocks manually there.");
    return;
  }

  for (const migration of migrations) {
    await client
      .patch(migration.id)
      .set(getPatchPayload(migration.nextDocument))
      .commit({ autoGenerateArrayKeys: false });
  }

  console.log("Migration complete. It is now safe to open the affected draft in Sanity Studio.");
}

main().catch((error) => {
  const permission = error as {
    statusCode?: number;
    details?: { type?: string };
  };

  if (permission.statusCode === 403 || permission.details?.type === "mutationError") {
    console.error(
      "Sanity rejected the mutation. Use a write-capable SANITY_API_WRITE_TOKEN with update permission, then re-run with --write.",
    );
    console.error(
      "Until the draft content is migrated, Studio can still fail on the legacy sectionHeading blocks.",
    );
  }

  console.error(error);
  process.exitCode = 1;
});
