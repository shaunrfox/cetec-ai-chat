import { useThreads } from '../hooks/useThreads';

export function ThreadList() {
  const { threads, deleteThread } = useThreads();

  return (
    <div>
      {threads.map(thread => (
        <div key={thread.id}>
          <h3>{thread.title}</h3>
          <p>Last updated: {thread.lastUpdated.toLocaleString()}</p>
          <button onClick={() => thread.id && deleteThread(thread.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
} 