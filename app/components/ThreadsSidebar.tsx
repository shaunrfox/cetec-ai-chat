import { Trash, X } from 'lucide-react';
import { useThreads } from '../hooks/useThreads';
import { Link } from '@remix-run/react';
import { useState } from 'react';

export function ThreadsSidebar() {
  const { threads, deleteThread } = useThreads();
  const [threadToDelete, setThreadToDelete] = useState<number | null>(null);

  const handleDeleteThread = (id: number) => {
    if (threadToDelete === id) {
      deleteThread(id);
      setThreadToDelete(null);
    } else {
      setThreadToDelete(id);
    }
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Your threads</h2>
      <div className="space-y-2 overflow-y-auto">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            to={`/thread/${thread.id}`}
            className="flex flex-col gap-2 p-2 hover:bg-gray-200 rounded cursor-pointer"
          >
            <h3 className="text-sm font-medium truncate">{thread.title}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-gray-500">
                {new Date(thread.lastUpdated).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-1">
              <button 
                className={`px-1.5 py-0.5 rounded-sm text-xs text-gray-500 hover:text-red-700 ${threadToDelete === thread.id ? "text-white bg-red-500 hover:text-white" : ""}`}
                onClick={(e) => {
                  e.preventDefault(); // Prevent Link navigation
                  handleDeleteThread(thread.id);
                }}
              >
                {threadToDelete === thread.id ? "Are you sure?" : "Delete"}
              </button>
              {threadToDelete === thread.id && (
                <button className="text-xs text-white bg-gray-800 outline outline-gray-300 outline-1 rounded-sm p-1 hover:bg-gray-600" onClick={() => setThreadToDelete(null)}><X className="w-3 h-3" /></button>
              )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
} 