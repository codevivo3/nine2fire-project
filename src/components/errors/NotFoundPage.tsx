import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type NotFoundPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  homeLabel: string;
  journalLabel: string;
  homeHref: string;
  journalHref: string;
};

export function NotFoundPage({
  eyebrow,
  title,
  description,
  note,
  homeLabel,
  journalLabel,
  homeHref,
  journalHref,
}: NotFoundPageProps) {
  return (
    <main className="py-16 md:py-24">
      <Container>
        <section className="mx-auto max-w-3xl rounded-[var(--radius-lg)] border border-border-token bg-surface p-6 backdrop-blur-lg md:p-10">
          <div className="section-grid gap-6">
            <div>
              <a href={homeHref} aria-label="Nine2Fire" className="inline-flex">
                <Image
                  className="logo-light h-auto w-38"
                  src="/logo/nine2fire-logo-text-dark-mode.svg"
                  alt="Nine2Fire"
                  width={158}
                  height={28}
                  priority
                />
                <Image
                  className="logo-dark h-auto w-38"
                  src="/logo/nine2fire-logo-text-light-mode.svg"
                  alt="Nine2Fire"
                  width={158}
                  height={28}
                  priority
                />
              </a>
            </div>

            <div className="section-grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token">
                {eyebrow}
              </p>
              <h1 className="text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
                {title}
              </h1>
              <p className="text-sm leading-7 text-foreground/72 md:text-base">
                {description}
              </p>
              <p className="text-sm leading-7 text-foreground/60 md:text-base">
                {note}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={homeHref} variant="gold">
                {homeLabel}
              </Button>
              <Button href={journalHref} variant="secondary">
                {journalLabel}
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
