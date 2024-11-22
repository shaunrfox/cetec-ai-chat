import { useThreads } from '../hooks/useThreads';
import { Link } from '@remix-run/react';

export function ThreadsSidebar() {
  const { threads } = useThreads();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <div className="space-y-2">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            to={`/chat/${thread.id}`}
            className="block p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            <h3 className="text-sm font-medium truncate">{thread.title}</h3>
            <p className="text-xs text-gray-500">
              {new Date(thread.lastUpdated).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
} 