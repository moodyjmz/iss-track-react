  
  export function sortCities(rawCountries: Country[] = []): Country[] {
    const comparer = new Intl.Collator('en').compare;
  
    // Filter out countries with empty capital names
    const filteredCountries = rawCountries.filter((country) => {
      return country.capital !== '';
    });
  
    // Sort countries by their capital names
    filteredCountries.sort((a, b) => {
      return comparer(a.capital, b.capital);
    });
  
    return filteredCountries;
  }
  