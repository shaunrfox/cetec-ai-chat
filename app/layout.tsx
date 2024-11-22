import { ThreadsSidebar } from './components/ThreadsSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <ThreadsSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 