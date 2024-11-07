import { useState } from 'react';
import { Sidebar } from './chat/Sidebar';
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
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
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
  );
}