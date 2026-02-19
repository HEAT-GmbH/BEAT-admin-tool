const ALL_COUNTRIES = "https://restcountries.com/v3.1/all?fields=name,cca2,flags";
const COUNTRIES_NOW_BASE = "https://countriesnow.space/api/v0.1/countries";

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  flags: {
    png: string;
    svg: string;
  };
}

class CountriesService {
  private COUNTRIES_MAP = new Map<string, Country>();

  constructor() {
    this.fetchCountries();
  }

  getCountries(): { name: string; code: string; flag: string }[] {
    if (!this.COUNTRIES_MAP.size) this.fetchCountries();

    return Array.from(this.COUNTRIES_MAP.values())
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
      .map((country) => ({
        name: country.name.common,
        code: country.cca2.toLowerCase(),
        flag: country.flags.svg || country.flags.png,
      }));
  }

  async fetchCountries() {
    if (this.COUNTRIES_MAP.size > 0) return this.COUNTRIES_MAP;

    try {
      const response = await fetch(ALL_COUNTRIES);
      const data: Country[] = await response.json();

      data.forEach((country) => {
        const code = country.cca2.toLowerCase();
        this.COUNTRIES_MAP.set(code, country);
      });
      return this.COUNTRIES_MAP;
    } catch (e) {
      console.error(e);
      return this.COUNTRIES_MAP;
    }
  }

  async getStates(countryCode: string): Promise<{ name: string }[]> {
    if (!countryCode) return [];
    try {
      const country = this.COUNTRIES_MAP.get(countryCode.toLowerCase());
      if (!country) return [];

      const response = await fetch(`${COUNTRIES_NOW_BASE}/states`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: country.name.common }),
      });
      const data = await response.json();
      if (data.error) return [];
      return data.data.states.map((s: any) => ({ name: s.name }));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getCities(
    countryCode: string,
    stateName: string
  ): Promise<{ name: string }[]> {
    if (!countryCode || !stateName) return [];
    try {
      const country = this.COUNTRIES_MAP.get(countryCode.toLowerCase());
      if (!country) return [];

      const response = await fetch(`${COUNTRIES_NOW_BASE}/state/cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country.name.common,
          state: stateName,
        }),
      });
      const data = await response.json();
      if (data.error) return [];
      return data.data.map((city: string) => ({ name: city }));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  getName(countryCode: string) {
    if (!countryCode) return null;
    const country = this.COUNTRIES_MAP.get(countryCode.toLowerCase());
    return country ? country.name.common : null;
  }

  getOfficialName(countryCode: string) {
    if (!countryCode) return null;
    const country = this.COUNTRIES_MAP.get(countryCode.toLowerCase());
    return country ? country.name.official : null;
  }

  getCountryCodeByName(countryName: string) {
    if (!countryName) return null;
    return Array.from(this.COUNTRIES_MAP.entries()).find(([, country]) => {
      return (
        country.name.common.toLowerCase() === countryName.toLowerCase() ||
        country.name.official.toLowerCase() === countryName.toLowerCase()
      );
    })?.[0];
  }

  hasCountry(countryCode: string) {
    if (!countryCode) return false;
    return this.COUNTRIES_MAP.has(countryCode.toLowerCase());
  }
}

export const countriesService = new CountriesService();