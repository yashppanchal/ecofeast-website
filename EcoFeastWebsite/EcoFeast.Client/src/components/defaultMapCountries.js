// Fallback map countries — used when the API returns an empty list
// or when running offline with fallback data in App.jsx.
// Shape matches MapCountryDto from the API (minus id/displayOrder).
export const DEFAULT_MAP_COUNTRIES = [
  { id: -1, name: 'India',         latitude: 22,  longitude: 78,  isHome: true,  isActive: true, displayOrder: 1 },
  { id: -2, name: 'Africa',        latitude: 5,   longitude: 20,  isHome: false, isActive: true, displayOrder: 2 },
  { id: -3, name: 'Middle East',   latitude: 28,  longitude: 48,  isHome: false, isActive: true, displayOrder: 3 },
  { id: -4, name: 'Europe',        latitude: 50,  longitude: 15,  isHome: false, isActive: true, displayOrder: 4 },
  { id: -5, name: 'USA',           latitude: 40,  longitude: -95, isHome: false, isActive: true, displayOrder: 5 },
  { id: -6, name: 'South America', latitude: -15, longitude: -58, isHome: false, isActive: true, displayOrder: 6 },
  { id: -7, name: 'Asia',          latitude: 35,  longitude: 105, isHome: false, isActive: true, displayOrder: 7 },
];
