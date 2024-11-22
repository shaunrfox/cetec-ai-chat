import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { createThread, updateThread, deleteThread, getAllThreads } from "~/utils/threads.server";
import { messages } from "~/db/sqlite.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const threads = await getAllThreads();
  return json({ threads });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get('_action');

  try {
    switch (_action) {
      case 'createThread': {
        const title = formData.get('title') as string;
        const lastUpdated = formData.get('lastUpdated') as string;
        const threadMessages = JSON.parse(formData.get('messages') as string || '[]');
        
        // Create thread first and get the ID
        const threadId = await createThread({ title, lastUpdated });
        
        // Create all messages with the new thread ID
        for (const msg of threadMessages) {
          await messages.create({
            threadId,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toISOString()
          });
        }
        
        // Return a properly structured response
        return json({ success: true, id: threadId });
      }

      case 'updateThread': {
        const id = parseInt(formData.get('id') as string);
        const updates = {
          title: formData.get('title') as string,
          lastUpdated: formData.get('lastUpdated') as string,
        };
        
        await updateThread(id, updates);
        
        // Handle messages update if provided
        const newMessages = JSON.parse(formData.get('messages') as string || '[]');
        if (newMessages.length > 0) {
          for (const msg of newMessages) {
            if (!msg.id) { // Only create new messages
              await messages.create({
                threadId: id,
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.timestamp).toISOString()
              });
            }
          }
        }
        
        return json({ success: true });
      }

      case 'deleteThread': {
        const id = parseInt(formData.get('id') as string);
        await deleteThread(id);
        return json({ success: true });
      }

      default:
        return json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Thread operation failed:', error);
    return json({ error: 'Operation failed' }, { status: 500 });
  }
} 