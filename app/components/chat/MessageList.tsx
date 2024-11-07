import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Copy, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface MessageListProps {
    messages: Array<{
        id: string;
        role: string;
        content: string;
        createdAt: Date;
    }>;
    status: string;
    error?: string;
}

export function MessageList({ messages, status, error }: MessageListProps) {
    return (
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="flex space-x-3"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'assistant'
                                ? 'bg-yellow-100'
                                : 'bg-zinc-100'
                            }`}>
                            {message.role === 'assistant' ? '🤖' : '👤'}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">
                                    {message.role === 'assistant' ? 'Cetec Support Bot' : 'You'}
                                </span>
                                <div className="flex items-center space-x-2 text-sm text-zinc-500">
                                    <span>{format(new Date(message.createdAt || Date.now()), 'MMM d, h:mm a')}</span>
                                    {message.role === 'assistant' && (
                                        <>
                                            <Button variant="ghost" size="sm" className="h-6">
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6">
                                                <MessageSquare className="w-3 h-3" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="prose prose-sm max-w-none">
                                {message.role === 'assistant' ? (
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                return (
                                                    <code
                                                        className={`${className} ${inline ? 'bg-zinc-100 rounded px-1' : 'block bg-zinc-900 text-white p-2 rounded'
                                                            }`}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            },
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
                    </div>
                ))}
                {status === 'in_progress' && (
                    <div className="flex items-center space-x-2 text-zinc-500">
                        <div className="animate-pulse flex space-x-1">
                            <div className="h-2 w-2 bg-zinc-400 rounded-full"></div>
                            <div className="h-2 w-2 bg-zinc-400 rounded-full animation-delay-200"></div>
                            <div className="h-2 w-2 bg-zinc-400 rounded-full animation-delay-400"></div>
                        </div>
                        <span>AI is thinking...</span>
                    </div>
                )}
                {error && (
                    <div className="text-red-500 mt-2">Error: {error}</div>
                )}
            </div>
        </ScrollArea>
    );
} 