import { useState, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface UseOpenAIAssistant {
  messages: Message[];
  status: 'idle' | 'in_progress';
  error: string | null;
  submitMessage: (content: string) => Promise<void>;
}

export function useOpenAIAssistant(initialMessages: Message[] = []): UseOpenAIAssistant {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [status, setStatus] = useState<'idle' | 'in_progress'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submitMessage = useCallback(async (content: string) => {
    setStatus('in_progress');
    setError(null);

    try {
      // Add user message immediately
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content,
        createdAt: new Date()
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(5));
            if (data.status) {
              setStatus(data.status === 'completed' ? 'idle' : 'in_progress');
            } else if (data.role === 'assistant') {
              setMessages(prev => [...prev, {
                id: data.id,
                role: data.role,
                content: data.content,
                createdAt: new Date()
              }]);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setStatus('idle');
    }
  }, [messages]);

  return { messages, status, error, submitMessage };
}