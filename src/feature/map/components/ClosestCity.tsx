import { useGetClosestCapital } from '../hooks/useGetClosestCapital';

export default function ClosestCapital({ countries, position }) {
    const closestCityName = useGetClosestCapital({ countries, position });
    return (
        <>
            {closestCityName ? closestCityName : 'The closest city is not yet known'}
        </>
    )
}