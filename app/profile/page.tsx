'use server';

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AccountSection from '@/components/profile/AccountSection';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  // user puede no tener id, pero para el dashboard es suficiente mostrar datos básicos
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <AccountSection
          user={{
            ...session.user,
            phone: session.user.phone?.toString() || null,
          }}
        />
        <div className="my-8 border-t" />
      </main>
    </div>
  );
}
