import useGetClosestCity from '../hooks/useGetClosestCity';
export default function ClosestCity({ countries, position }) {
    const closestCityName = useGetClosestCity({ countries, position });
    return (
        <>
            {closestCityName ? closestCityName : 'The closest city is not yet known'}
        </>
    )
}