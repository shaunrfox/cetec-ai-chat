import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'chat.db'), {
  verbose: console.log
});

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    lastUpdated TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    threadId INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (threadId) REFERENCES threads(id) ON DELETE CASCADE
  );
`);

export interface Thread {
  id: number;
  title: string;
  lastUpdated: string;
  messages?: Message[];
}

export interface Message {
  id: number;
  threadId: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const threads = {
  async create(thread: Omit<Thread, 'id'>) {
    const stmt = db.prepare(
      'INSERT INTO threads (title, lastUpdated) VALUES (?, ?)'
    );
    const result = stmt.run(thread.title, thread.lastUpdated);
    return result.lastInsertRowid as number;
  },

  async get(id: number): Promise<Thread | null> {
    const thread = db.prepare('SELECT * FROM threads WHERE id = ?').get(id);
    if (!thread) return null;

    const messages = db.prepare('SELECT * FROM messages WHERE threadId = ?').all(id);
    return { ...thread, messages };
  },

  async getAll(): Promise<Thread[]> {
    return db.prepare('SELECT * FROM threads ORDER BY lastUpdated DESC').all();
  },

  async update(id: number, updates: Partial<Thread>) {
    const stmt = db.prepare(
      'UPDATE threads SET title = COALESCE(?, title), lastUpdated = COALESCE(?, lastUpdated) WHERE id = ?'
    );
    return stmt.run(updates.title, updates.lastUpdated, id);
  },

  async delete(id: number) {
    return db.prepare('DELETE FROM threads WHERE id = ?').run(id);
  }
};

export const messages = {
  async create(message: Omit<Message, 'id'>) {
    const stmt = db.prepare(
      'INSERT INTO messages (threadId, role, content, timestamp) VALUES (?, ?, ?, ?)'
    );
    return stmt.run(
      message.threadId,
      message.role,
      message.content,
      message.timestamp
    );
  },

  async getByThreadId(threadId: number): Promise<Message[]> {
    return db.prepare('SELECT * FROM messages WHERE threadId = ? ORDER BY timestamp ASC')
      .all(threadId);
  }
};

export async function debugDB() {
  const threads = db.prepare('SELECT * FROM threads').all();
  const messages = db.prepare('SELECT * FROM messages').all();
  
  console.log('=== Database Debug ===');
  console.log('Threads:', threads);
  console.log('Messages:', messages);
  console.log('===================');
}

export { db }; 