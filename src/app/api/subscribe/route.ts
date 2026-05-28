
import { NextResponse } from 'next/server';
import {
  isSubscriptionSource,
  subscriptionSources,
  type SubscribeRequestPayload,
} from '@/lib/subscriptions';

// Beehiiv API docs (v2): https://developers.beehiiv.com/reference/create-subscriber
// Required env vars:
// - BEEHIIV_API_KEY
// - BEEHIIV_PUBLICATION_ID

function getRequiredEnv(name: 'BEEHIIV_API_KEY' | 'BEEHIIV_PUBLICATION_ID') {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function getSafeEmailHint(email: string) {
  const [localPart = '', domain = ''] = email.split('@');
  const localHint =
    localPart.length > 0 ? `${localPart.slice(0, 1)}***` : '***';

  return domain ? `${localHint}@${domain}` : localHint;
}

async function readBeehiivErrorBody(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch {
    return 'Unable to read Beehiiv error body';
  }
}

function buildBeehiivSubscriptionPayload(
  email: string,
  source: string,
) {
  return {
    email,
    reactivate_existing: true,
    send_welcome_email: true,
    // Beehiiv's create-subscription endpoint supports UTM attribution fields
    // without requiring prior publication configuration.
    utm_source: source,
    // TODO: If Nine2Fire adds a dedicated Beehiiv custom field for acquisition
    // source, send the same value through `custom_fields` as well so segments
    // can be built without relying only on UTM attribution.
  };
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Partial<SubscribeRequestPayload>;
    const { email, source } = payload;
    const resolvedSource = source ?? subscriptionSources.newsletter;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (source !== undefined && !isSubscriptionSource(source)) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    }

    const API_KEY = getRequiredEnv('BEEHIIV_API_KEY');
    const PUBLICATION_ID = getRequiredEnv('BEEHIIV_PUBLICATION_ID');

    if (!API_KEY || !PUBLICATION_ID) {
      console.error('[subscribe] missing Beehiiv configuration', {
        hasApiKey: Boolean(API_KEY),
        hasPublicationId: Boolean(PUBLICATION_ID),
        source: resolvedSource,
      });

      return NextResponse.json(
        {
          error: 'Server not configured',
          details: {
            missing: [
              !API_KEY ? 'BEEHIIV_API_KEY' : null,
              !PUBLICATION_ID ? 'BEEHIIV_PUBLICATION_ID' : null,
            ].filter(Boolean),
            source: resolvedSource,
          },
        },
        { status: 500 }
      );
    }

    const beehiivPayload = buildBeehiivSubscriptionPayload(email, resolvedSource);

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(beehiivPayload),
      }
    );

    if (!res.ok) {
      const responseBody = await readBeehiivErrorBody(res);

      console.error('[subscribe] Beehiiv subscription failed', {
        status: res.status,
        statusText: res.statusText,
        source: resolvedSource,
        emailHint: getSafeEmailHint(email),
        beehiivResponse: responseBody,
      });

      return NextResponse.json(
        {
          error: 'Beehiiv subscription failed',
          details: {
            status: res.status,
            source: resolvedSource,
            beehiivResponse: responseBody,
          },
        },
        { status: 502 }
      );
    }

    console.info('[subscribe] subscription accepted', {
      source: resolvedSource,
      emailHint: getSafeEmailHint(email),
    });

    return NextResponse.json({ ok: true, source: resolvedSource });
  } catch (error) {
    console.error('[subscribe] unexpected subscription error', {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
            }
          : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
