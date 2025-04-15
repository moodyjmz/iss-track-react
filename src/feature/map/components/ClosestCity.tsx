import { Coordinates } from '../defs/coordinates';
import { Country } from '../defs/country';
import { getClosestCapital } from '../utils/countries/getClosestCapital';

interface ClosestCapitalProps {
    countries: Country[];
    position: Coordinates;
}

export default function ClosestCapital({ countries, position }: ClosestCapitalProps) {
    const closestCityName = getClosestCapital({ countries, position });
    return (
        <>
            {closestCityName ? closestCityName : 'The closest city is not yet known'}
        </>
    );
}