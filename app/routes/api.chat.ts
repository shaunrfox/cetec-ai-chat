import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.ASSISTANT_ID;

export const action: ActionFunction = async ({ request }) => {
  try {
    // Validate OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    if (!process.env.ASSISTANT_ID) {
      throw new Error('ASSISTANT_ID is not configured');
    }

    // Log the assistant ID we're using
    console.log('Using Assistant ID:', process.env.ASSISTANT_ID);

    // Verify the assistant exists
    try {
      const assistant = await openai.beta.assistants.retrieve(process.env.ASSISTANT_ID);
      console.log('Assistant found:', {
        name: assistant.name,
        model: assistant.model,
        id: assistant.id
      });
    } catch (error) {
      console.error('Failed to retrieve assistant:', error);
      throw new Error('Could not verify assistant configuration');
    }

    const body = await request.json();
    const { messages, threadId } = body;

    // Log incoming request
    console.log('Incoming request:', {
      threadId,
      messageCount: messages?.length,
      lastMessage: messages?.[messages.length - 1]?.content
    });

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let thread;
    try {
      if (threadId) {
        thread = await openai.beta.threads.retrieve(threadId);
      } else {
        thread = await openai.beta.threads.create();
      }
    } catch (error) {
      console.error('Thread error:', error);
      return new Response(JSON.stringify({ error: 'Failed to create/retrieve thread' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messages[messages.length - 1].content,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID || "",
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let runStatus;
          do {
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            
            // Send status updates as properly formatted SSE
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ status: runStatus.status })}\n\n`)
            );
            
            await new Promise(resolve => setTimeout(resolve, 500));
          } while (runStatus.status === 'in_progress' || runStatus.status === 'queued');

          if (runStatus.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(thread.id);
            const lastMessage = messages.data[0];
            
            if (lastMessage?.content[0] && 'text' in lastMessage.content[0]) {
              // Send message data as properly formatted SSE
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({
                  role: 'assistant',
                  content: lastMessage.content[0].text.value,
                  id: lastMessage.id,
                  threadId: thread.id
                })}\n\n`)
              );
            }
            
            // Send completion event as proper JSON
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
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};