'use client';

import { Suspense } from 'react';
import BillingPageContent from './billing-content';
import { Loader2 } from 'lucide-react';

export default function BillingPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <BillingPageContent />
    </Suspense>
  );
}