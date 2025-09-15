
export default function speedFromUnit(unit: string) {
    // we could have a lookup table, and still can, however
    return unit && unit.length ? unit[0]+'ph' : 'unknown';
}