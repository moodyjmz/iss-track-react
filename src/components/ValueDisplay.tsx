import { useRef, useEffect, memo, useMemo } from 'react';
import '@/lib/scrambler-element.ts';

// Force TypeScript to recognize scrambler-element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'scrambler-element': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        unit?: string;
        duration?: string;
        locale?: string;
        'decimal-places'?: string;
        ref?: React.Ref<HTMLElement>;
      };
    }
  }
}

function ValueDisplay({ value, title, decimalPlaces, unit, locale = 'en-GB' }: ValueDisplayProps) {
    const scrambler = useRef<HTMLElement | null>(null);

    // For numbers, pass the raw number to the scrambler element for proper animation
    // The scrambler will handle formatting internally
    const scramblerValue = useMemo(() =>
        typeof value === 'number' ?
            (typeof decimalPlaces === 'number' ? value.toFixed(decimalPlaces) : String(value)) :
            String(value)
    , [value, decimalPlaces]);

    // Update the scrambler element when value changes
    useEffect(() => {
        if (scrambler.current) {
            scrambler.current.setAttribute('value', scramblerValue);
            if (unit) {
                scrambler.current.setAttribute('unit', unit);
            }
            // Set duration for animations (optional)
            scrambler.current.setAttribute('duration', '1000');
        }
    }, [scramblerValue, unit]);

    // Set initial value when component mounts
    useEffect(() => {
        if (scrambler.current) {
            scrambler.current.setAttribute('value', scramblerValue);
            if (unit) {
                scrambler.current.setAttribute('unit', unit);
            }
            scrambler.current.setAttribute('duration', '1000');
        }
    }, []);

    return (
        <div className='value-display out-of-focus'>
            <h6>{title}</h6>
            <scrambler-element ref={scrambler} />
        </div>
    );
}

export default memo(ValueDisplay);