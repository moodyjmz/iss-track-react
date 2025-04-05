export function getLocationCoordinates(res) {
    const coords = { };
    if (res.iss_position) {
        coords.longitude = Number(res.iss_position.longitude);
        coords.latitude = Number(res.iss_position.latitude);
        // coords.longitude = Math.random();
        // coords.latitude = Math.random();
    }
    console.log(coords);

    return coords;
}
