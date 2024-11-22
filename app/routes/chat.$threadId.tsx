import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useState, useEffect } from 'react';
import { ThreadsSidebar } from '~/components/ThreadsSidebar';
import { MessageList } from '~/components/chat/MessageList';
import { InputArea } from '~/components/chat/InputArea';
import { TopBar } from '~/components/chat/TopBar';
import { getThread } from "../utils/threads.server";
import { useOpenAIAssistant } from "~/hooks/useOpenAIAssistant";

// Loader function runs on the server
export async function loader({ params }: LoaderFunctionArgs) {
  const threadId = params.threadId;
  
  if (!threadId) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const thread = await getThread(threadId);
    
    if (!thread) {
      throw new Response("Thread not found", { status: 404 });
    }

    return json({ thread });
  } catch (error) {
    console.error("Error loading thread:", error);
    throw new Response("Error loading thread", { status: 500 });
  }
}

// Component renders on the client
export default function ChatThread() {
  const { thread } = useLoaderData<typeof loader>();
  const [input, setInput] = useState('');
  
  // Convert thread messages to the format expected by useOpenAIAssistant
  const initialMessages = thread.messages?.map(msg => ({
    id: msg.id.toString(),
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    timestamp: new Date(msg.timestamp)
  })) || [];

  const { messages, status, error, submitMessage } = useOpenAIAssistant(initialMessages);

  const onSubmit = async (input: string) => {
    if (!input.trim()) return;
    await submitMessage(input);
    setInput('');
  };

  return (
    <div className="flex h-screen bg-background">
      <ThreadsSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
        <MessageList 
          messages={messages.length > 0 ? messages : initialMessages}
          status={status}
          error={error}
        />
        
        <InputArea 
          input={input}
          setInput={setInput}
          onSubmit={onSubmit}
          status={status}
        />
      </div>
    </div>
  );
}
