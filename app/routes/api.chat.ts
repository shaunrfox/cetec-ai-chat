import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.ASSISTANT_ID;

export const action: ActionFunction = async ({ request }) => {
  try {
    if (!process.env.OPENAI_API_KEY || !process.env.ASSISTANT_ID) {
      throw new Error('OpenAI configuration missing');
    }

    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1];

    let thread = await openai.beta.threads.create();
    
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: lastMessage.content,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID as string,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let runStatus;
          do {
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ status: runStatus.status })}\n\n`)
            );
            await new Promise(resolve => setTimeout(resolve, 500));
          } while (runStatus.status === 'in_progress' || runStatus.status === 'queued');

          if (runStatus.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(thread.id);
            const lastMessage = messages.data[0];
            
            if (lastMessage?.content[0] && 'text' in lastMessage.content[0]) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({
                  role: 'assistant',
                  content: lastMessage.content[0].text.value,
                  id: lastMessage.id,
                })}\n\n`)
              );
            }
            
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ status: 'done' })}\n\n`)
            );
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });
  } catch (error) {
    console.error('API route error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};