import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Send, Mic } from 'lucide-react';

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (input: string) => void;
  status: string;
}

export function InputArea({ input, setInput, onSubmit, status }: InputAreaProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(input);
  };

  return (
    <div className="border-t p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1"
          disabled={status === 'in_progress'}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={status === 'in_progress' || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost">
          <Mic className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
} 