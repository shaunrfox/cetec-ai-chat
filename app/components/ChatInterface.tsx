import { useState } from 'react';
import { ThreadsSidebar } from './ThreadsSidebar';
import { MessageList } from './chat/MessageList';
import { InputArea } from './chat/InputArea';
import { useOpenAIAssistant } from "~/hooks/useOpenAIAssistant";
import { TopBar } from './chat/TopBar';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const { messages, status, error, submitMessage } = useOpenAIAssistant();

  const onSubmit = async (input: string) => {
    if (!input.trim()) return;
    await submitMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-background outline outline-gray-200">
        <TopBar />

      <div className="flex-1 flex">
        <ThreadsSidebar />
        
        <div className="flex-1 flex flex-col">
          <MessageList 
            messages={messages} 
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
    </div>
  );
}