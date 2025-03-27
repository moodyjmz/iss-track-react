import { useEffect, useState } from 'react';
import { logger } from '../utils/logger';

export function useIsTabVisible() {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {

        const controller = new AbortController();

        const { signal } = controller;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                logger.log('⏸️ Window lost focus, pausing polling...');
                setIsVisible(false);
            } else {
                logger.log('▶️ Window gained focus, resuming polling...');
                setIsVisible(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange, { signal });
        return (() => controller.abort());
    }, []);
    return isVisible;
}