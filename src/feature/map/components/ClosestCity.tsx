import { getClosestCapital } from '../utils/countries/getClosestCapital';

export default function ClosestCapital({ countries, position }) {
    const closestCityName = getClosestCapital({ countries, position });
    return (
        <>
            {closestCityName ? closestCityName : 'The closest city is not yet known'}
        </>
    )
}