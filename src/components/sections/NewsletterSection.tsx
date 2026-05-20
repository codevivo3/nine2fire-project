'use client';
/**
 * FILE: src/components/sections/NewsletterSection.tsx
 *
 * PURPOSE:
 * - Closes the landing page with a lightweight lead capture interaction
 *
 * NOTES:
 * - The form remains presentational for now; submission wiring can be added later
 */
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function NewsletterSection() {
  const t = useTranslations('Newsletter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section>
      <Container className='py-16 md:py-24'>
        <div className='rounded-[var(--radius-lg)] border border-border-token bg-surface p-6 backdrop-blur-lg md:p-10'>
          <div className='section-grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] md:items-end'>
            <div className='section-grid gap-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token'>
                {t('eyebrow')}
              </p>
              <h2 className='max-w-2xl text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl'>
                {t('title')}
              </h2>
              <p className='max-w-xl text-sm leading-7 text-foreground/72 md:text-base'>
                {t('description')}
              </p>
            </div>

            <form
              className='section-grid gap-3'
              onSubmit={async (e) => {
                e.preventDefault();
                if (isSubmitting) return;

                setIsSubmitting(true);
                setError(null);

                const form = e.currentTarget;
                const formData = new FormData(form);
                const email = formData.get('email');

                try {
                  const res = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                  });

                  if (!res.ok) throw new Error('Failed to subscribe');

                  setIsSuccess(true);
                  form.reset();
                } catch {
                  setError('Something went wrong. Try again.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <label htmlFor='email' className='sr-only'>
                {t('emailLabel')}
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                placeholder={t('emailPlaceholder')}
                className='h-12 rounded-full border border-border-token bg-input backdrop-blur-sm px-5 text-sm outline-none placeholder:text-primary-token focus:border-accent-token'
              />
              <Button
                type='submit'
                variant='gold'
                className='w-full'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : t('button')}
              </Button>

              {isSuccess && (
                <p className='text-sm text-accent-token'>
                  You&apos;re in. Check your inbox.
                </p>
              )}

              {error && <p className='text-sm text-red-500'>{error}</p>}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
