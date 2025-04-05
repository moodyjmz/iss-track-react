export default function Position({ position }) {
    return (
        <>
            {position ? `${position.latitude}, ${position.longitude}` : null}
        </>
    )
}
