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

    console.log('Received webhook event');

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Webhook event type:', event.type);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err);
      return new NextResponse('Webhook signature verification failed', { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('Processing checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerkUserId;

        console.log('Session details:', {
          sessionId: session.id,
          clerkUserId,
          customerId: session.customer,
          paymentStatus: session.payment_status,
        });

        if (clerkUserId) {
          try {
            // First verify we can fetch the user
            const user = await client.users.getUser(clerkUserId);
            console.log('Found Clerk user:', user.id);

            // Update user's subscription status in Clerk
            await client.users.updateUserMetadata(clerkUserId, {
              publicMetadata: {
                subscribed: true,
                stripeSessionId: session.id, // Adding for tracking
                lastUpdated: new Date().toISOString()
              }
            });
            console.log('✅ Successfully updated Clerk metadata for user:', clerkUserId);
          } catch (error) {
            console.error('❌ Error updating Clerk metadata:', error);
            throw error; // Re-throw to be caught by outer try-catch
          }
        } else {
          console.warn('⚠️ No clerkUserId found in session metadata');
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        console.log(`Processing ${event.type}`);
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log('Subscription details:', {
          subscriptionId: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          customerId: subscription.customer
        });
        
        // Find the clerk user ID from the customer metadata
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if ('deleted' in customer) {
            console.error('❌ Customer has been deleted');
            return;
        }

        const clerkUserId = customer.metadata?.clerkUserId;       
        console.log('Customer metadata:', customer.metadata);

        if (clerkUserId) {
          const isSubscribed = subscription.status === 'active' && 
                             !subscription.cancel_at_period_end;
          
          try {
            await client.users.updateUserMetadata(clerkUserId, {
              publicMetadata: {
                subscribed: isSubscribed,
                lastUpdated: new Date().toISOString()
              }
            });
            console.log('✅ Successfully updated subscription status for user:', clerkUserId, 'isSubscribed:', isSubscribed);
          } catch (error) {
            console.error('❌ Error updating Clerk metadata:', error);
            throw error;
          }
        } else {
          console.warn('⚠️ No clerkUserId found in customer metadata');
        }
        break;
      }

      case 'invoice.payment_failed': {
        console.log('Processing invoice.payment_failed');
        const invoice = event.data.object as Stripe.Invoice;
        const customer = await stripe.customers.retrieve(invoice.customer as string);
        
        if ('deleted' in customer) {
          console.error('❌ Customer has been deleted');
          return;
        }
        
        const clerkUserId = customer.metadata?.clerkUserId;

        if (clerkUserId) {
          console.log(`⚠️ Payment failed for user ${clerkUserId}`);
          try {
            await client.users.updateUserMetadata(clerkUserId, {
              publicMetadata: {
                subscribed: false,
                lastUpdated: new Date().toISOString()
              }
            });
            console.log('✅ Updated user metadata to reflect failed payment');
          } catch (error) {
            console.error('❌ Error updating Clerk metadata:', error);
            throw error;
          }
        }
        break;
      }
    }

    return new NextResponse('Webhook handled successfully', { status: 200 });
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}