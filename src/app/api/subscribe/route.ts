
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

    const API_KEY = process.env.BEEHIIV_API_KEY;
    const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    if (!API_KEY || !PUBLICATION_ID) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(
          buildBeehiivSubscriptionPayload(email, resolvedSource)
        ),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'Beehiiv error', details: text },
        { status: 502 }
      );
    }

    console.info('[subscribe] subscription accepted', {
      source: resolvedSource,
    });

    return NextResponse.json({ ok: true, source: resolvedSource });
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
