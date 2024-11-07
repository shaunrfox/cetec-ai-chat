import type { MetaFunction } from "@remix-run/node";
import { ChatInterface } from "~/components/ChatInterface";

export const meta: MetaFunction = () => {
  return [
    { title: "Cetec Support Bot" },
    { name: "description", content: "Chat with your AI assistant powered by OpenAI" },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cetec Support Bot</h1>
      <ChatInterface />
    </div>
  );
}