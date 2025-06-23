interface ValueDisplayProps {
    value: string | number;
    title: string;
    decimalPlaces?: number;
    unit?: string;
    locale?: string;
}

export default function ValueDisplay({ value, title, decimalPlaces, unit, locale = 'en-GB' }: ValueDisplayProps) {
    let finalValue = value;
    let numberFormatOptions: Intl.NumberFormatOptions = {};
    // type is string or number
    if (typeof value === 'number') {
        if (typeof decimalPlaces === 'number') {
            numberFormatOptions.maximumFractionDigits = decimalPlaces;
        }
        if (unit) {
            numberFormatOptions.style = 'unit';
            numberFormatOptions.unit = unit;
        }
        finalValue = new Intl.NumberFormat(locale, numberFormatOptions).format(value);

    }


    return (
        <div className='value-display'>
            <h6>{title}</h6>
            <span>{finalValue}</span>
        </div>
    );
}