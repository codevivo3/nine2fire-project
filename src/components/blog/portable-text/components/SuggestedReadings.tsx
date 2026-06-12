import type { AppLocale } from "@/i18n/routing";
import { BlogCard } from "@/components/blog/BlogCard";
import { ResourceCard } from "./ResourceCard";
import type { PortableTextSuggestedReadings } from "../types";

type SuggestedReadingsProps = {
  locale: AppLocale;
  value: PortableTextSuggestedReadings;
};

export function SuggestedReadings({
  locale,
  value,
}: SuggestedReadingsProps) {
  return (
    <section className="my-14 space-y-6 border-t border-border-token pt-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
          {value.title || "Suggested readings"}
        </h2>
        {value.intro ? (
          <p className="max-w-2xl text-sm leading-6 text-foreground/72">
            {value.intro}
          </p>
        ) : null}
      </div>

      {value.posts?.length ? (
        <div className="space-y-2">
          {value.posts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              locale={locale}
              variant="archive"
            />
          ))}
        </div>
      ) : null}

      {value.resources?.length ? (
        <div className="grid gap-4">
          {value.resources.map((resource, index) => (
            <ResourceCard
              key={`${resource.title || "resource"}-${index}`}
              value={resource}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

