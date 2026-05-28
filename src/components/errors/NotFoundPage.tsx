import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type NotFoundPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  homeLabel: string;
  journalLabel: string;
  homeHref: string;
  journalHref: string;
};

export function NotFoundPage({
  eyebrow,
  title,
  description,
  homeLabel,
  journalLabel,
  homeHref,
  journalHref,
}: NotFoundPageProps) {
  return (
    <main className='py-16 md:py-24'>
      <Container>
        <section className='relative mx-auto max-w-3xl overflow-hidden rounded-[var(--radius-lg)] border border-border-token bg-surface p-6 backdrop-blur-lg md:p-10'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute right-3 top-16 select-none text-[7rem] font-black leading-none tracking-[-0.08em] text-foreground/[0.065] [text-shadow:1px_1px_0_rgba(255,255,255,0.04),-1px_-1px_0_rgba(0,0,0,0.18)] sm:right-5 sm:text-[9rem] md:right-8 md:top-12 md:text-[12rem]'
          >
            {eyebrow}
          </div>

          <div className='section-grid relative z-10 gap-6'>
            <div>
              <a href={homeHref} aria-label='Nine2Fire' className='inline-flex'>
                <Image
                  className='logo-light h-auto w-38'
                  src='/logo/nine2fire-logo-text-dark-mode.svg'
                  alt='Nine2Fire'
                  width={158}
                  height={28}
                  priority
                />
                <Image
                  className='logo-dark h-auto w-38'
                  src='/logo/nine2fire-logo-text-light-mode.svg'
                  alt='Nine2Fire'
                  width={158}
                  height={28}
                  priority
                />
              </a>
            </div>

            <div className='section-grid max-w-2xl gap-4 md:gap-5'>
              <h1 className='text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl'>
                {title}
              </h1>
              <p className='text-sm leading-7 text-foreground/72 md:text-base'>
                {description}
              </p>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button href={homeHref} variant='gold'>
                {homeLabel}
              </Button>
              <Button href={journalHref} variant='secondary'>
                {journalLabel}
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
