import { useState, useEffect, useRef } from 'react';

export const useAsyncData = function (promiseFn) {
    const [dataPromise, setdataPromise] = useState();
    const abortController = useRef();

    useEffect(() => {
        abortController.current = new AbortController();
        const { signal } = abortController.current;
        setdataPromise(promiseFn({ signal }));

        return () => {
            abortController.current.abort();
        };
    }, [abortController, promiseFn]);

    return dataPromise;
}
