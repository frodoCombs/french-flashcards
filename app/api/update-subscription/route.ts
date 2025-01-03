import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
      const { userId } = await auth();
      const client = await clerkClient();
      
      if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
      console.log('Attempting to update metadata for user:', userId);

      // Update the user's metadata
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscribed: true,
        },
      });
      console.log('Metadata updated successfully for user:', userId);

      return new NextResponse('Subscription updated successfully', { status: 200 });
    } catch (error) {
      console.error('Error updating subscription:', error);
      return new NextResponse('Error updating subscription', { status: 500 });
    }
  }
  