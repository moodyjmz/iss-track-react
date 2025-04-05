export function sortCities(rawCountries = []) {
    const comparer = new Intl.Collator('en').compare;
    const _countries = rawCountries.filter(country => {
        return country.capital !== '';
    });
    _countries.sort((a, b) => {
        return comparer(a.capital, b.capital);
    });
    return _countries;
}
