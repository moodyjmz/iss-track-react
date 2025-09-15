import { useState, useEffect, useRef } from 'react';
import type { ApiArgs, ApiFetchFunction } from '../types/apiCallOptions';

export function useAsyncData<T = unknown>(
    promiseFn: ApiFetchFunction<T>,
    args?: Record<string, unknown>
): Promise<T> | null {
    const [dataPromise, setdataPromise] = useState<Promise<T> | null>(null);
    const abortController = useRef<AbortController|null>(null);

    useEffect(() => {
        abortController.current = new AbortController();
        const { signal } = abortController.current;
        setdataPromise(promiseFn({ args, signal }));

        return () => {
            abortController.current && abortController.current.abort();
        };
    }, [abortController, promiseFn, args]);

    return dataPromise;
}
