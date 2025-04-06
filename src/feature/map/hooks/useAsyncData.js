import { useState, useEffect, useRef } from 'react';

export const useAsyncData = function (promiseFn, args) {
    const [dataPromise, setdataPromise] = useState();
    const abortController = useRef();

    useEffect(() => {
        abortController.current = new AbortController();
        const { signal } = abortController.current;
        setdataPromise(promiseFn({ args, signal }));

        return () => {
            abortController.current.abort();
        };
    }, [abortController, promiseFn, args]);

    return dataPromise;
}
