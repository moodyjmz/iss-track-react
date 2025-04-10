import { JSX, use } from 'react';

interface RiseTimeProps {
    risePromise: Promise<{ result?: string }>;
}

export default function RiseTime({ risePromise }: RiseTimeProps): JSX.Element {
    const riseTime = use(risePromise);

    return (
        <>
            {riseTime?.result ? riseTime.result : `Not visible in the next 12 hours`}
        </>
    );
}