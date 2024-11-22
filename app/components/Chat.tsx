import { useThreads } from '../hooks/useThreads';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Thread } from '~/db/database';

interface ChatProps {
  initialThread?: Thread;
}

export function Chat({ initialThread }: ChatProps) {
  const { threadId } = useParams();
  const { saveThread, updateThread, getThread } = useThreads();
  const [currentThread, setCurrentThread] = useState(initialThread);

  useEffect(() => {
    if (threadId) {
      const loadThread = async () => {
        const thread = await getThread(threadId);
        setCurrentThread(thread);
      };
      loadThread();
    }
  }, [threadId, getThread]);

  const handleNewMessage = async (message: string) => {
    const newMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    if (threadId && currentThread) {
      await updateThread(threadId, {
        lastUpdated: new Date(),
        messages: [...currentThread.messages, newMessage]
      });
    } else {
      await saveThread({
        title: 'New Chat',
        lastUpdated: new Date(),
        messages: [newMessage]
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentThread?.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
          if (input.value.trim()) {
            handleNewMessage(input.value);
            input.value = '';
          }
        }}
        className="border-t p-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="message"
            placeholder="Type a message..."
            className="flex-1 rounded-lg border p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 