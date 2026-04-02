'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppointmentsPage() {
  const router = useRouter();
  
  // For now, redirecting to dashboard where appointments are currently managed
  // as per the existing codebase search results.
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground animate-pulse">Redirecting to dashboard...</p>
    </div>
  );
}
