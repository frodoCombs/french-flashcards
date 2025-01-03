import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getStripe } from '@/config/stripe';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse('Webhook error', { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === 'checkout.session.completed') {
    const userId = session.metadata.userId;

    // Update user metadata in Clerk
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        subscribed: true,
        stripeCustomerId: session.customer,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}

export const runtime = 'nodejs';