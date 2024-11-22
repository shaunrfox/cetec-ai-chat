import { useFetcher, useLoaderData } from '@remix-run/react';
import type { Thread } from '~/db/sqlite.server';
import { useEffect, useState } from 'react';

interface ThreadResponse {
  success?: boolean;
  id: number;
}

export function useThreads() {
  const fetcher = useFetcher<{ threads: Thread[] } | ThreadResponse>();
  const [threads, setThreads] = useState<Thread[]>([]);

  // Load threads
  useEffect(() => {
    fetcher.load('/api/threads');
  }, []);

  // Update threads when fetcher data changes
  useEffect(() => {
    if (fetcher.data?.threads) {
      setThreads(fetcher.data.threads);
    }
  }, [fetcher.data]);

  const saveThread = async (thread: Omit<Thread, 'id'>) => {
    const formData = new FormData();
    formData.append('_action', 'createThread');
    formData.append('title', thread.title);
    formData.append('lastUpdated', thread.lastUpdated);
    formData.append('messages', JSON.stringify(thread.messages || []));

    await fetcher.submit(formData, {
      method: 'post',
      action: '/api/threads'
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    const response = fetcher.data as ThreadResponse;
    if (!response?.id) {
      throw new Error('Failed to create thread: No ID returned');
    }
    return { id: response.id };
  };

  const updateThread = async (id: number, updates: Partial<Thread>) => {
    const formData = new FormData();
    formData.append('_action', 'updateThread');
    formData.append('id', id.toString());
    if (updates.title) formData.append('title', updates.title);
    if (updates.lastUpdated) formData.append('lastUpdated', new Date().toISOString());
    if (updates.messages) formData.append('messages', JSON.stringify(updates.messages));

    fetcher.submit(formData, {
      method: 'post',
      action: '/api/threads'
    });
  };

  const deleteThread = async (id: number) => {
    const formData = new FormData();
    formData.append('_action', 'deleteThread');
    formData.append('id', id.toString());

    fetcher.submit(formData, {
      method: 'post',
      action: '/api/threads'
    });
  };

  return {
    threads,
    saveThread,
    updateThread,
    deleteThread,
    isLoading: fetcher.state === 'submitting'
  };
} 