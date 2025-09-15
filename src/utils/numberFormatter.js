export const numberFormatter = (number, decimalPlaces = 3, type = 'significant', style = 'decimal', locale = 'en-GB') => {
    return new Intl.NumberFormat(locale, { maximumSignificantDigits: decimalPlaces }).format(number);
}