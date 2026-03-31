import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Footer } from '@/components/layout/Footer';
import { KakaoChatButton } from '@/components/ui/KakaoChatButton';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <Topbar />
        <main className="flex-1 p-6 bg-[var(--bg)]">{children}</main>
        <Footer />
      </div>
      <KakaoChatButton />
    </div>
  );
}
