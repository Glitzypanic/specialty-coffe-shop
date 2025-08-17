import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import OrdersSection from '@/components/profile/OrdersSection';

async function fetchOrders(email: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/orders?email=${email}`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.orders || [];
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/auth/signin');
  const orders = await fetchOrders(session.user.email);
  return <OrdersSection orders={orders} />;
}
