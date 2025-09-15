import { useEffect, useRef, useState } from 'react';
import { logger } from '../utils/logger';

type FetchFunction<T> = (options: { signal: AbortSignal }) => Promise<T>;

export function usePolling<T>(
    fetchFunction: FetchFunction<T>,
    isPolling: boolean = true,
    interval: number = 5000
): Promise<T> | null {
    const [dataPromise, setDataPromise] = useState<Promise<T> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        if (!isPolling) return;

        let isActive = true;

        const poll = async () => {
            logger.log('⏳ Fetching');
            const promise = fetchFunction({ signal });

            setDataPromise(promise);
            await promise; // Wait for response

            if (isActive) {
                timeoutRef.current = setTimeout(poll, interval);
            }
        };

        poll(); // Start polling

        return () => {
            logger.log('🛑 Stopping polling...');
            isActive = false;
            timeoutRef.current && clearTimeout(timeoutRef.current);
            controller.abort();
        };
    }, [fetchFunction, interval, isPolling]);

    return dataPromise;
}