interface ValueDisplayProps {
    value: string|number;
    title: string;
}

export default function ValueDisplay({ value, title }: ValueDisplayProps) {
    return (
        <div className='value-display'>
            <h6>{title}</h6>
            <span>{value}</span>
        </div>
    );
}