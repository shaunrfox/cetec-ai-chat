import type { MetaFunction } from "@remix-run/node";
import { ChatInterface } from "~/components/ChatInterface";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Cetec Support Bot" },
    { name: "description", content: "Chat with your AI assistant powered by OpenAI" },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto p-0">
      <ChatInterface />
    </div>
  );
}