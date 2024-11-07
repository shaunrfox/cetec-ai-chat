import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
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
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'assistant' 
                  ? 'bg-blue-50 text-blue-900' 
                  : 'bg-green-50 text-green-900'
              }`}
            >
              <div className="font-semibold mb-1">
                {message.role === 'assistant' ? 'Cetec Support Bot' : 'You'}
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      // Style code blocks
                      code({ node, inline, className, children, ...props }) {
                        return (
                          <code
                            className={`${className} ${
                              inline ? 'bg-gray-200 rounded px-1' : 'block bg-gray-800 text-white p-2 rounded'
                            }`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      // Style links
                      a({ node, children, ...props }) {
                        return (
                          <a
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          >
                            {children}
                          </a>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
              </div>
            </div>
          ))}
          {status === 'in_progress' && (
            <div className="text-gray-500 p-3">AI is thinking...</div>
          )}
          {error && (
            <div className="text-red-500 mt-2 p-3">Error: {error}</div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={onSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow"
            disabled={status === 'in_progress'}
          />
          <Button 
            type="submit" 
            disabled={status === 'in_progress' || !input.trim()}
          >
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}