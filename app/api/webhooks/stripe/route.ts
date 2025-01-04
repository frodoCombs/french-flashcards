import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") as string;
    const client = await clerkClient();

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new NextResponse('Webhook signature verification failed', { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerkUserId;

        if (clerkUserId) {
          // Update user's subscription status in Clerk
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              subscribed: true
            }
          });
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find the clerk user ID from the customer metadata
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        // Check if customer is deleted
        if ('deleted' in customer) {
            console.error('Customer has been deleted');
            return;
        }

        const clerkUserId = customer.metadata?.clerkUserId;       
        if (clerkUserId) {
          // Update subscription status based on the subscription status
          const isSubscribed = subscription.status === 'active' && 
                             !subscription.cancel_at_period_end;
          
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              subscribed: isSubscribed
            }
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customer = await stripe.customers.retrieve(invoice.customer as string);
        // Check if customer is deleted
        if ('deleted' in customer) {
          console.error('Customer has been deleted');
          return;
        }
        
        const clerkUserId = customer.metadata?.clerkUserId;

        if (clerkUserId) {
          // Optionally update user metadata or send notifications
          console.log(`Payment failed for user ${clerkUserId}`);
        }
        break;
      }
    }

    return new NextResponse('Webhook handled successfully', { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}

// Configure the endpoint to accept raw body
export const config = {
  api: {
    bodyParser: false,
  },
}