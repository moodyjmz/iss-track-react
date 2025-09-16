import { JSX } from 'react';

// Define a type for the position prop
interface PositionProps {
    position: Coordinates | null;
}

export default function Position({ position }: PositionProps): JSX.Element {
    return (
        <>
            {position ? `${position.latitude}, ${position.longitude}` : null}
        </>
    );
}