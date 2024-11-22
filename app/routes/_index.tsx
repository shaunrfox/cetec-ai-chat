import type { MetaFunction } from "@remix-run/node";
import { ChatInterface } from "~/components/ChatInterface";
import { useEffect } from "react";
import { testDatabase } from "~/db/database";

export const meta: MetaFunction = () => {
  return [
    { title: "Cetec Support Bot" },
    { name: "description", content: "Chat with your AI assistant powered by OpenAI" },
  ];
};

export default function Index() {
  useEffect(() => {
    // testDatabase();
  }, []);

  return (
    <div className="container mx-auto p-0">
      <ChatInterface />
    </div>
  );
}