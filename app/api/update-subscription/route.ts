import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const SUBSCRIPTION_PRICE_ID = process.env.STRIPE_PRICE_ID!;

export async function POST(request: Request) {
  try {
      const { action } = await request.json(); // Get subscribe/unsubscribe action
      const { userId } = await auth();
      const client = await clerkClient();
      
      if (!userId) {
          return new NextResponse('Unauthorized', { status: 401 });
      }

      const user = await client.users.getUser(userId);
      // Handle subscription creation
      if (action === 'subscribe') {
        // Check if user already has a Stripe customer ID
        let stripeCustomerId = user.privateMetadata.stripeCustomerId as string;
  
        if (!stripeCustomerId) {
          // Create a new Stripe customer
          const customer = await stripe.customers.create({
            email: user.emailAddresses[0].emailAddress,
            metadata: {
              clerkUserId: userId
            }
          });
    
        stripeCustomerId = customer.id;
    
        // Save Stripe customer ID to Clerk user metadata
        await client.users.updateUserMetadata(userId, {
          privateMetadata: {
            stripeCustomerId: customer.id
          }
        });
      }
  
      // Create a subscription checkout session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
            {
              price: SUBSCRIPTION_PRICE_ID,
              quantity: 1,
            },
          ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
        metadata: {
          clerkUserId: userId
        }
      });

      return NextResponse.json({ url: session.url });
      
    } else if (action === 'unsubscribe') {
      const stripeCustomerId = user.privateMetadata.stripeCustomerId as string;
      
      if (!stripeCustomerId) {
        return new NextResponse('No active subscription found', { status: 400 });
      }
  
      // Find active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'active'
      });
      
      if (subscriptions.data.length === 0) {
        return new NextResponse('No active subscription found', { status: 400 });
      }
  
      // Cancel subscription at period end
      await stripe.subscriptions.update(subscriptions.data[0].id, {
        cancel_at_period_end: true
      });
  
      // Update Clerk metadata
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscribed: false
        }
      });
  
    return new NextResponse('Subscription cancelled successfully', { status: 200 });
  }

  return new NextResponse('Invalid action', { status: 400 });

  } catch (error) {
  console.error('Error handling subscription:', error);
  return new NextResponse('Error processing subscription', { status: 500 });
  }
}

  