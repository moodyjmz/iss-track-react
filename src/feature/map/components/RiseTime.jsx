import { use } from 'react';

export default function RiseTime({ risePromise }) {
    const riseTime = use(risePromise);
    console.log('riseTime', riseTime);
    return (
        <>
            {riseTime?.result ? riseTime.result : `Not visible in the next 12 hours`}
        </>
    )
}