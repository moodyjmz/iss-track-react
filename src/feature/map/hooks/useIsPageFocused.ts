import { useEffect, useState } from 'react';

export function useIsPageFocused(): boolean {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const handleVisibilityChange = () => {
            setIsVisible(document.hasFocus());
        };

        window.addEventListener('focus', handleVisibilityChange, { signal });
        window.addEventListener('blur', handleVisibilityChange, { signal });

        return () => controller.abort();
    }, []);

    return isVisible;
}
