'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('No user found, redirecting to coming soon');
          router.push('/coming-soon');
          return;
        }

        console.log('User found:', user.email);

        // Check if user is in whitelist
        const { data: whitelist, error } = await supabase
          .from('early_access')
          .select('*')
          .eq('email', user.email)
          .single();

        console.log('Whitelist check:', { whitelist, error });

        if (whitelist) {
          console.log('✅ User has early access!');
          setHasAccess(true);
        } else {
          console.log('❌ User not in whitelist, redirecting');
          router.push('/coming-soon');
        }
      } catch (err) {
        console.error('Error checking access:', err);
        router.push('/coming-soon');
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}