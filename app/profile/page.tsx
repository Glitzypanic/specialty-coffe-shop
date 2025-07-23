'use server';

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SideNav from '@/components/profile/SideNav';
import AccountSection from '@/components/profile/AccountSection';
import OrdersSection from '@/components/profile/OrdersSection';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  // user puede no tener id, pero para el dashboard es suficiente mostrar datos básicos
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 border-r">
        <SideNav />
      </aside>
      <main className="flex-1 p-8">
        <AccountSection user={session.user} />
        <div className="my-8 border-t" />
        <OrdersSection />
      </main>
    </div>
  );
}
