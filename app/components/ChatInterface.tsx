import { useState } from 'react';
import { useOpenAIAssistant } from "~/hooks/useOpenAIAssistant";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";

export function ChatInterface() {
  const [input, setInput] = useState('');
  const { messages, status, error, submitMessage } = useOpenAIAssistant();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await submitMessage(input);
    setInput('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Cetec Support Bot</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === 'assistant' ? 'text-blue-600' : 'text-green-600'
              }`}
            >
              <strong>{message.role === 'assistant' ? 'AI: ' : 'You: '}</strong>
              {message.content}
            </div>
          ))}
          {status === 'in_progress' && (
            <div className="text-gray-500">AI is thinking...</div>
          )}
          {error && (
            <div className="text-red-500 mt-2">Error: {error}</div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={onSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Type your message here..."
            className="flex-grow"
          />
          <Button type="submit" disabled={status === 'in_progress' || !input.trim()}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}