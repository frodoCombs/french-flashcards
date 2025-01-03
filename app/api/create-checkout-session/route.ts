import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/config/stripe';

const URL = process.env.NEXT_PUBLIC_APP_URL;

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // You'll need to create this in Stripe Dashboard
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${URL}/`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Error creating checkout session', { status: 500 });
  }
}