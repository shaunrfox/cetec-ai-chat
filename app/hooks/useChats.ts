import { useState, useEffect } from 'react';
import { db, type Thread } from '~/db/database';

export function useChats() {
    const [threads, setThreads] = useState<Thread[]>([]);

    useEffect(() => {
        const loadThreads = async () => {
            const storedThreads = await db.threads.toArray();
            setThreads(storedThreads);
        };

        loadThreads();
    }, []);
    
    return { threads };
} 