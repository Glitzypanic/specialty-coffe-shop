import SideNav from '@/components/profile/SideNav';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside>
        <SideNav />
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
