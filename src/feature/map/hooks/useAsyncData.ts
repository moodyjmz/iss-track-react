import { useState, useEffect, useRef } from 'react';
export type ApiArgs = {args:any, signal:AbortSignal}|undefined;

export type ApiFetchFunction = ({}: ApiArgs) => Promise<any>;

export function useAsyncData(promiseFn: ApiFetchFunction, args?:any): Promise<any>|null {
    const [dataPromise, setdataPromise] = useState<Promise<any>|null>(null);
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
