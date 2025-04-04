import { useEffect, useRef, useState } from 'react';
import { logger } from '../utils/logger';

export function usePolling(fetchFunction, isPolling = true, interval = 5000) {
    const [dataPromise, setDataPromise] = useState(null);
    const timeoutRef = useRef();
    useEffect(() => {
        const controller = new AbortController();

        const { signal } = controller;
        if (!isPolling) return;
        let isActive = true;

        const poll = async () => {
            logger.log('⏳ Fetching');
            const promise = fetchFunction({signal});

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
            clearTimeout(timeoutRef.current);
            controller.abort();
            
        };
    }, [fetchFunction, interval, isPolling]);

    return dataPromise;
}
