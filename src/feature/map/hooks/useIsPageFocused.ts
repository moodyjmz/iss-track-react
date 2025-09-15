import { useEffect, useState } from 'react';

export function useIsPageFocused(callback: (isVisible: boolean) => void): boolean {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    useEffect(() => {
        callback && callback(isVisible);
    }, [isVisible]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const handleVisibilityChange = () => {
            console.log('document.hasFocus()', document.hasFocus());
            setIsVisible(document.hasFocus());
        };

        window.addEventListener('focus', handleVisibilityChange, { signal });
        window.addEventListener('blur', handleVisibilityChange, { signal });

        return () => controller.abort();
    }, []);
    console.log('isVisible', isVisible);
    return isVisible;
}
