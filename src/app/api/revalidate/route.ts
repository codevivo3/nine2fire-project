import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { sanityRevalidateSecret } from "@/lib/sanity/serverEnv";

type LocalizedSlug = {
  current?: string;
};

type RevalidateWebhookBody = {
  _type?: string;
  slug?: {
    en?: LocalizedSlug;
    it?: LocalizedSlug;
  };
};

const basePaths = ["/", "/en", "/it", "/en/blog", "/it/blog"] as const;

function readSecret(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("authorization")?.trim();

  if (searchParams.get("secret")) {
    return searchParams.get("secret")?.trim() || "";
  }

  if (request.headers.get("x-sanity-secret")) {
    return request.headers.get("x-sanity-secret")?.trim() || "";
  }

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return "";
}

function readSlug(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getRevalidationPaths(body: RevalidateWebhookBody) {
  const paths = new Set<string>(basePaths);
  const englishSlug = readSlug(body.slug?.en?.current);
  const italianSlug = readSlug(body.slug?.it?.current);

  if (englishSlug) {
    paths.add(`/en/blog/${englishSlug}`);
  }

  if (italianSlug) {
    paths.add(`/it/blog/${italianSlug}`);
  }

  return Array.from(paths);
}

export async function POST(request: Request) {
  if (!sanityRevalidateSecret) {
    return NextResponse.json(
      { ok: false, message: "Missing SANITY_REVALIDATE_SECRET on the server." },
      { status: 500 },
    );
  }

  const requestSecret = readSecret(request);

  if (!requestSecret || requestSecret !== sanityRevalidateSecret) {
    return NextResponse.json(
      { ok: false, message: "Invalid revalidation secret." },
      { status: 401 },
    );
  }

  let body: RevalidateWebhookBody = {};

  try {
    body = (await request.json()) as RevalidateWebhookBody;
  } catch {
    body = {};
  }

  const revalidatedPaths = getRevalidationPaths(body);

  for (const path of revalidatedPaths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    message: "Revalidation triggered.",
    documentType: body._type || null,
    revalidatedPaths,
  });
}
