import { createContext } from 'react';
import { Country } from '../defs/country';

export const CountriesContext = createContext<Promise<Country[]>|null>(null);
