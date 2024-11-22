import { threads } from "~/db/sqlite.server";
import type { Thread } from "~/db/sqlite.server";

export async function getThread(threadId: string): Promise<Thread | null> {
  try {
    return await threads.get(parseInt(threadId));
  } catch (error) {
    console.error("Error fetching thread:", error);
    return null;
  }
}

export async function getAllThreads(): Promise<Thread[]> {
  try {
    return await threads.getAll();
  } catch (error) {
    console.error("Error fetching threads:", error);
    return [];
  }
}

export async function createThread(thread: Omit<Thread, 'id'>) {
  try {
    const result = await threads.create(thread);
    if (!result) {
      throw new Error('Failed to create thread');
    }
    return result;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
}

export async function updateThread(id: number, updates: Partial<Thread>) {
  try {
    return await threads.update(id, updates);
  } catch (error) {
    console.error("Error updating thread:", error);
    throw error;
  }
}

export async function deleteThread(id: number) {
  try {
    return await threads.delete(id);
  } catch (error) {
    console.error("Error deleting thread:", error);
    throw error;
  }
} 