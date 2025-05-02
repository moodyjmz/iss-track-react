interface ValueDisplayProps {
    value: string|number;
    title: string;
    decimalPlaces?: number;
    units?: string;
}

export default function ValueDisplay({ value, title, decimalPlaces, units }: ValueDisplayProps) {
    let finalValue = value;
    if(typeof decimalPlaces === 'number') {
        console.log(value)
        finalValue = new Number(value).toFixed(decimalPlaces);
    }
    if(units) {
        finalValue = finalValue + units;
    }
    return (
        <div className='value-display'>
            <h6>{title}</h6>
            <span>{finalValue}</span>
        </div>
    );
}